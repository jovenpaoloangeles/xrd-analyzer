import sGolay from 'ml-savitzky-golay';

export interface SmoothingOptions {
  enabled: boolean;
  windowSize?: number;
  polynomial?: number;
}

export const smoothSignal = (
  y: number[],
  options: SmoothingOptions = { enabled: false }
): number[] => {
  if (!options.enabled) {
    return [...y];
  }

  const { windowSize = 5, polynomial = 2 } = options;

  if (y.length < windowSize) {
    return [...y];
  }

  try {
    // API: sGolay(data, delta, options)
    // ml-savitzky-golay trims edges (windowSize - 1) / 2
    const result = sGolay(y, 1, { windowSize, polynomial });
    
    // Pad edges with original data to maintain length
    const padLen = Math.floor(windowSize / 2);
    
    // Construct full array: Left Original + Smoothed + Right Original
    const leftPad = y.slice(0, padLen);
    const rightPad = y.slice(y.length - padLen);
    
    return [...leftPad, ...result, ...rightPad];

  } catch (error) {
    console.error("Smoothing failed", error);
    return [...y];
  }
};