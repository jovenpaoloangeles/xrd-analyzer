// Refinement Web Worker
import { ProcessedData, CrystalStructure } from '../types';
import { simulateXRD } from '../utils/xrdSimulator';
import LM from 'ml-levenberg-marquardt';

export interface RefinementInput {
  experimentalData: ProcessedData[];
  structure: CrystalStructure;
  paramsToRefine: string[]; // e.g., ['a', 'scale']
  wavelength: number;
}

export interface RefinementOutput {
  calculatedIntensity: number[];
  refinedStructure: CrystalStructure;
  rwp: number;
  refinedScale: number;
}

self.onmessage = (event: MessageEvent<RefinementInput>) => {
  const { experimentalData, structure, paramsToRefine, wavelength } = event.data;

  const angles = experimentalData.map(d => d.angle);
  const observed = experimentalData.map(d => d.backgroundSubtracted ?? d.intensity);

  // Initial parameters: [scale, a, b, c, alpha, beta, gamma]
  // In a full implementation, we'd map paramsToRefine indices
  const initialValues = [1.0, structure.a, structure.b, structure.c];

  const functionToOptimize = ([scale, a, b, c]: number[]) => {
    const s = { ...structure, a, b, c };
    return simulateXRD(s, angles, wavelength, scale);
  };

  try {
    const options = {
      damping: 1.5,
      initialValues,
      gradientDifference: 0.1,
      maxIterations: 20,
      errorTolerance: 1e-5,
    };

    const result = LM({ x: observed, y: observed }, functionToOptimize, options);
    
    const [refinedScale, refinedA, refinedB, refinedC] = result.parameterValues;
    
    const refinedStructure = {
      ...structure,
      a: refinedA,
      b: refinedB,
      c: refinedC,
    };

    const calculatedIntensity = simulateXRD(refinedStructure, angles, wavelength, refinedScale);
    
    // Calculate Rwp (Weighted Profile R-factor)
    let sumDiffSq = 0;
    let sumObsSq = 0;
    observed.forEach((obs, i) => {
      const diff = obs - calculatedIntensity[i];
      sumDiffSq += diff * diff;
      sumObsSq += obs * obs;
    });
    const rwp = Math.sqrt(sumDiffSq / sumObsSq);

    const output: RefinementOutput = {
      calculatedIntensity,
      refinedStructure,
      rwp,
      refinedScale
    };

    self.postMessage(output);
  } catch (error) {
    console.error("Refinement failed", error);
    // Post back error or original
  }
};
