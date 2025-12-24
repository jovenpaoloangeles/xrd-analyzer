import { ProcessedData, Peak, ProcessingParams } from '../types';

export const findPeaks = (data: ProcessedData[], params: ProcessingParams): Peak[] => {
  // Step 1: Find all local maxima
  let candidates: { index: number; intensity: number }[] = [];
  const maxIntensity = Math.max(...data.map(d => d.backgroundSubtracted ?? 0));
  
  for (let i = 1; i < data.length - 1; i++) {
    const curr = data[i].backgroundSubtracted ?? 0;
    const prev = data[i - 1].backgroundSubtracted ?? 0;
    const next = data[i + 1].backgroundSubtracted ?? 0;
    
    let passes = true;
    
    // Min height
    if (params.peaks.useMinHeight) {
      let minHeightThreshold: number;
      if (maxIntensity === 0) {
        minHeightThreshold = params.peaks.minHeight;
      } else {
        minHeightThreshold = maxIntensity * params.peaks.minHeight;
      }
      
      if (curr <= minHeightThreshold) passes = false;
    }
    
    if (curr <= prev || curr <= next) passes = false;
    
    if (passes) {
      candidates.push({ index: i, intensity: curr });
    }
  }

  // Step 2: Sort by intensity (descending)
  candidates.sort((a, b) => b.intensity - a.intensity);

  // Step 3: Enforce minDistance
  const accepted: number[] = [];
  for (let c of candidates) {
    if (params.peaks.useMinDistance) {
      if (accepted.some(idx => Math.abs(data[idx].angle - data[c.index].angle) < params.peaks.minDistance)) {
        continue;
      }
    }
    accepted.push(c.index);
  }

  // Step 4: Calculate prominence for each accepted peak
  const prominent: number[] = [];
  for (let idx of accepted) {
    let left = idx, right = idx;
    // Move left to valley
    while (left > 0 && (data[left].backgroundSubtracted ?? 0) >= (data[left - 1].backgroundSubtracted ?? 0)) left--;
    // Move right to valley
    while (right < data.length - 1 && (data[right].backgroundSubtracted ?? 0) >= (data[right + 1].backgroundSubtracted ?? 0)) right++;
    
    const leftValley = data[left].backgroundSubtracted ?? 0;
    const rightValley = data[right].backgroundSubtracted ?? 0;
    const curr = data[idx].backgroundSubtracted ?? 0;
    const prominence = curr - Math.max(leftValley, rightValley);
    
    if (params.peaks.useMinProminence) {
      if (prominence < params.peaks.minProminence) continue;
    }
    prominent.push(idx);
  }

  // Step 5: Fit peaks and return
  const peaks: Peak[] = [];
  for (let idx of prominent) {
    const peakData = fitPeak(data, idx);
    const crystalliteSize = calculateCrystalliteSize(
      peakData.angle,
      peakData.width,
      params.peaks.wavelength,
      params.peaks.instrumentBroadening
    );
    peaks.push({ ...peakData, crystalliteSize });
  }

  // Sort peaks by angle before returning
  return peaks.sort((a, b) => a.angle - b.angle);
};

const fitPeak = (data: ProcessedData[], peakIndex: number): Peak => {
  const peakIntensity = data[peakIndex].backgroundSubtracted ?? 0;
  const peakAngle = data[peakIndex].angle;
  
  // Extract region around peak for fitting
  const fitWindow = 20;
  const start = Math.max(0, peakIndex - fitWindow);
  const end = Math.min(data.length, peakIndex + fitWindow);
  
  const xData = data.slice(start, end).map(d => d.angle);
  const yData = data.slice(start, end).map(d => d.backgroundSubtracted ?? 0);

  // Fit Gaussian and Lorentzian functions
  const gaussianFit = fitGaussian(xData, yData, peakAngle, peakIntensity);
  const lorentzianFit = fitLorentzian(xData, yData, peakAngle, peakIntensity);
  
  // Choose best fit based on R-squared value
  const bestFit = gaussianFit.rSquared > lorentzianFit.rSquared ? gaussianFit : lorentzianFit;
  
  return {
    angle: bestFit.params.center,
    intensity: bestFit.params.amplitude,
    width: bestFit.params.width,
    area: calculatePeakArea(bestFit),
    fit: {
      type: bestFit.type,
      params: bestFit.params,
    },
  };
};

const calculateCrystalliteSize = (
  peakAngle: number,
  peakWidth: number,
  wavelength: number,
  instrumentBroadening: number
): number => {
  // Scherrer equation: t = K*λ/(β*cos(θ))
  const K = 0.9; // Scherrer constant
  
  // β is the FWHM of the peak in RADIANS, corrected for instrumental broadening
  const bSquared = Math.pow(peakWidth, 2) - Math.pow(instrumentBroadening, 2);
  const β = (bSquared > 0 ? Math.sqrt(bSquared) : peakWidth) * (Math.PI / 180);
  
  // θ is the Bragg angle (half of 2θ) in RADIANS
  const θ = (peakAngle / 2) * (Math.PI / 180);
  
  return (K * wavelength) / (β * Math.cos(θ));
};

// Helper functions for peak fitting (Placeholders for now, but keeping the logic)
const fitGaussian = (_x: number[], _y: number[], center: number, amplitude: number) => {
  return {
    type: 'gaussian' as const,
    params: { center, amplitude, width: 0.1 },
    rSquared: 0.9,
  };
};

const fitLorentzian = (_x: number[], _y: number[], center: number, amplitude: number) => {
  return {
    type: 'lorentzian' as const,
    params: { center, amplitude, width: 0.1 },
    rSquared: 0.8,
  };
};

const calculatePeakArea = (_fit: any) => {
  return 1.0;
};
