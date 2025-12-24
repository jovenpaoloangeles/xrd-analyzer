import { describe, it, expect } from 'vitest';
import { findPeaks } from './dataProcessing';
import { ProcessingParams, ProcessedData } from '../types';

describe('findPeaks', () => {
  const defaultParams: ProcessingParams = {
    smoothing: { enabled: false, windowSize: 5, polynomialOrder: 2 },
    background: { enabled: false, method: 'sliding', windowSize: 20, iterations: 3 },
    peaks: {
      minHeight: 0.1,
      minDistance: 0.5,
      minProminence: 10,
      instrumentBroadening: 0.1,
      wavelength: 1.5406,
      useMinHeight: true,
      useMinDistance: true,
      useMinProminence: true,
    },
  };

  it('should find a single clear peak', () => {
    const data: ProcessedData[] = [
      { angle: 10, intensity: 10, backgroundSubtracted: 10 },
      { angle: 11, intensity: 10, backgroundSubtracted: 10 },
      { angle: 12, intensity: 100, backgroundSubtracted: 100 },
      { angle: 13, intensity: 10, backgroundSubtracted: 10 },
      { angle: 14, intensity: 10, backgroundSubtracted: 10 },
    ];

    const peaks = findPeaks(data, defaultParams);
    expect(peaks.length).toBe(1);
    expect(peaks[0].angle).toBeCloseTo(12);
  });

  it('should respect minHeight threshold', () => {
    const data: ProcessedData[] = [
      { angle: 10, intensity: 10, backgroundSubtracted: 10 },
      { angle: 11, intensity: 100, backgroundSubtracted: 100 }, // Max = 100
      { angle: 12, intensity: 10, backgroundSubtracted: 10 },
      { angle: 13, intensity: 5, backgroundSubtracted: 5 }, // Below 10% (0.1 * 100)
      { angle: 14, intensity: 10, backgroundSubtracted: 10 },
      { angle: 15, intensity: 10, backgroundSubtracted: 10 },
    ];

    const peaks = findPeaks(data, defaultParams);
    expect(peaks.length).toBe(1);
    expect(peaks[0].angle).toBe(11);
  });

  it('should respect minDistance threshold', () => {
    const data: ProcessedData[] = [
      { angle: 10, intensity: 10, backgroundSubtracted: 10 },
      { angle: 11, intensity: 100, backgroundSubtracted: 100 },
      { angle: 11.2, intensity: 90, backgroundSubtracted: 90 }, // Too close to 11 (dist 0.2 < 0.5)
      { angle: 12, intensity: 10, backgroundSubtracted: 10 },
    ];

    const peaks = findPeaks(data, defaultParams);
    expect(peaks.length).toBe(1);
    expect(peaks[0].angle).toBe(11);
  });
});
