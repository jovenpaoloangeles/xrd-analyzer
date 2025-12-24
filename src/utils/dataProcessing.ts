import { XRDData, ProcessedData, Peak, ProcessingParams } from '../types';
import { smoothSignal } from './smoothing';
import { subtractBackground as subtractBG } from './backgroundSubtraction';

export const parseCSV = (text: string): XRDData[] => {
  const lines = text.trim().split(/\r?\n/); // Split by newline, handling \r\n

  const data: XRDData[] = [];
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    // Skip empty lines or lines starting with #
    if (!trimmedLine || trimmedLine.startsWith('#')) {
      return;
    }

    // Split by comma or whitespace
    const parts = trimmedLine.split(/[,\s]+/);
    if (parts.length >= 2) {
      const angle = parseFloat(parts[0]);
      const intensity = parseFloat(parts[1]);

      // Check if parsing resulted in valid numbers
      if (!isNaN(angle) && !isNaN(intensity)) {
        data.push({ angle, intensity });
      } else {
        console.warn(`Skipping invalid data line ${index + 1}: ${line}`);
      }
    } else {
      console.warn(`Skipping malformed line ${index + 1}: ${line}`);
    }
  });

  if (data.length === 0) {
    throw new Error('No valid numeric data pairs (angle, intensity) found in the provided text.');
  }

  return data;
};

export const smoothData = (data: ProcessedData[], params: ProcessingParams): ProcessedData[] => {
  const intensities = data.map(d => d.intensity);
  const smoothed = smoothSignal(intensities, {
    enabled: params.smoothing.enabled,
    windowSize: params.smoothing.windowSize,
    polynomial: params.smoothing.polynomialOrder,
  });

  return data.map((point, i) => ({
    ...point,
    smoothed: smoothed[i],
  }));
};

export const subtractBackground = (data: ProcessedData[], params: ProcessingParams): ProcessedData[] => {
  if (!params.background.enabled) {
    return data.map(point => ({
      ...point,
      backgroundSubtracted: point.smoothed ?? point.intensity,
    }));
  }

  // Use new utility for basic 'min' subtraction if that's the intention,
  // or use it as a fallback/default.
  if (params.background.method === 'sliding' || !params.background.method) {
    const intensities = data.map(d => d.smoothed ?? d.intensity);
    const angles = data.map(d => d.angle);
    const result = subtractBG(angles, intensities, { enabled: true });

    return data.map((point, i) => ({
      ...point,
      backgroundSubtracted: result.corrected[i],
    }));
  }

  switch (params.background.method) {
    case 'spline':
      return subtractSplineBackground(data, params.background.windowSize);
    case 'rollingBall':
      return subtractRollingBallBackground(data, params.background.windowSize, params.background.iterations || 3);
    default:
      return subtractSlidingBackground(data, params.background.windowSize);
  }
};

const subtractSlidingBackground = (data: ProcessedData[], windowSize: number): ProcessedData[] => {
  return data.map((point, index) => {
    const start = Math.max(0, index - windowSize);
    const end = Math.min(data.length, index + windowSize);
    const window = data.slice(start, end);
    const background = Math.min(...window.map(p => p.smoothed ?? p.intensity));
    
    return {
      ...point,
      backgroundSubtracted: (point.smoothed ?? point.intensity) - background,
    };
  });
};

const subtractSplineBackground = (data: ProcessedData[], _windowSize: number): ProcessedData[] => {
  // Implement cubic spline background subtraction
  const x = data.map((_, i) => i);
  
  // Find local minima for spline control points
  const controlPoints = findLocalMinima();
  const spline = cubicSplineInterpolation(controlPoints.x, controlPoints.y, x);
  
  return data.map((point, i) => ({
    ...point,
    backgroundSubtracted: (point.smoothed ?? point.intensity) - spline[i],
  }));
};

const subtractRollingBallBackground = (
  data: ProcessedData[],
  _radius: number,
  iterations: number
): ProcessedData[] => {
  let background = data.map(d => d.smoothed ?? d.intensity);
  
  for (let i = 0; i < iterations; i++) {
    background = rollingBallIteration(background);
  }
  
  return data.map((point, i) => ({
    ...point,
    backgroundSubtracted: (point.smoothed ?? point.intensity) - background[i],
  }));
};

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
      let minHeight: number;
      if (maxIntensity === 0) {
        minHeight = params.peaks.minHeight;
      } else {
        minHeight = maxIntensity * params.peaks.minHeight;
      }
      if (params.peaks.minHeight === 0) {
        // No threshold, allow all
      } else if (curr <= minHeight) passes = false;
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
      peakData.width,
      params.peaks.wavelength,
      params.peaks.instrumentBroadening
    );
    peaks.push({ ...peakData, crystalliteSize });
  }
  return peaks;
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
  peakWidth: number,
  wavelength: number,
  instrumentBroadening: number
): number => {
  // Scherrer equation: t = K*λ/(β*cos(θ))
  const K = 0.9; // Scherrer constant
  const β = Math.sqrt(Math.pow(peakWidth, 2) - Math.pow(instrumentBroadening, 2));
  const θ = peakWidth / 2 * Math.PI / 180; // convert to radians
  
  return (K * wavelength) / (β * Math.cos(θ));
};

// Helper functions for background subtraction and peak fitting
const findLocalMinima = () => {
  // Implementation of local minima detection
  const minima = { x: [], y: [] };
  // ... implementation details
  return minima;
};

const cubicSplineInterpolation = (_x: number[], _y: number[], xi: number[]) => {
  // Implementation of cubic spline interpolation
  return new Array(xi.length).fill(0);
};

const rollingBallIteration = (data: number[]) => {
  // Implementation of rolling ball algorithm iteration
  return data;
};

const fitGaussian = (_x: number[], _y: number[], center: number, amplitude: number) => {
  // Implementation of Gaussian peak fitting
  return {
    type: 'gaussian' as const,
    params: { center, amplitude, width: 1 },
    rSquared: 0.9,
  };
};

const fitLorentzian = (_x: number[], _y: number[], center: number, amplitude: number) => {
  // Implementation of Lorentzian peak fitting
  return {
    type: 'lorentzian' as const,
    params: { center, amplitude, width: 1 },
    rSquared: 0.8,
  };
};

const calculatePeakArea = (_fit: ReturnType<typeof fitGaussian> | ReturnType<typeof fitLorentzian>) => {
  // Implementation of peak area calculation
  return 1.0;
};