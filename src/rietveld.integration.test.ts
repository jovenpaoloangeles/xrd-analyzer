import { describe, it, expect } from 'vitest';
import { parseCIF } from './utils/cifParser';
import { simulateXRD } from './utils/xrdSimulator';
import LM from 'ml-levenberg-marquardt';

describe('Rietveld Refinement Integration', () => {
  it('should refine lattice parameters from synthetic data', () => {
    // 1. Setup Structure (Silicon)
    const cif = `
      _cell_length_a 5.43
      _cell_length_b 5.43
      _cell_length_c 5.43
      loop_
      _atom_site_label
      _atom_site_type_symbol
      _atom_site_fract_x
      _atom_site_fract_y
      _atom_site_fract_z
      _atom_site_occupancy
      Si Si 0 0 0 1
    `;
    const structure = parseCIF(cif);
    
    // 2. Generate Synthetic "Experimental" Data (with a slight shift)
    const angles = Array.from({length: 100}, (_, i) => 10 + i * 0.5);
    const wavelength = 1.5406;
    const experimentalStructure = { ...structure, a: 5.435, b: 5.435, c: 5.435 };
    const observed = simulateXRD(experimentalStructure, angles, wavelength, 1.0);
    
    // 3. Run Refinement Logic (Simplified Worker logic)
    const initialValues = [1.0, structure.a]; // scale, a
    
    const functionToOptimize = ([scale, a]: number[]) => {
      const s = { ...structure, a, b: a, c: a };
      const simulated = simulateXRD(s, angles, wavelength, scale);
      return (x: number) => {
          const idx = angles.indexOf(x);
          return simulated[idx];
      };
    };

    const options = {
      damping: 0.1,
      initialValues,
      gradientDifference: 0.001,
      maxIterations: 20,
      errorTolerance: 1e-6,
    };

    const result = LM({ x: angles, y: observed }, functionToOptimize, options);
    const [refinedScale, refinedA] = result.parameterValues;

    // 4. Assert
    expect(refinedA).toBeCloseTo(5.435, 2);
    expect(refinedScale).toBeCloseTo(1.0, 1);
  });
});
