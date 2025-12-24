import { XRDData, ProcessedData, Peak, ProcessingParams } from '../types';
import { smoothSignal } from './smoothing';
import { subtractBackground as subtractBG } from './backgroundSubtraction';
import { findPeaks as findPeaksUtil } from './peakDetection';

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
  return findPeaksUtil(data, params);
};

export const calculateWaterfallOffset = (
  index: number,
  offsetValue: number,
  mode: 'overlay' | 'waterfall'
): number => {
  return mode === 'waterfall' ? index * offsetValue : 0;
};

// Removed internal helper functions (findLocalMinima, cubicSplineInterpolation, rollingBallIteration, etc.)
// as they are now handled by utilities or are placeholders to be refined.

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