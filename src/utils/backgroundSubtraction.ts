export interface BackgroundSubtractionResult {
  corrected: number[];
  background: number[];
}

export type BackgroundMethod = 'min' | 'polynomial';

export interface BackgroundOptions {
  enabled: boolean;
  method?: BackgroundMethod;
}

export const subtractBackground = (
  x: number[],
  y: number[],
  options: BackgroundOptions = { enabled: false }
): BackgroundSubtractionResult => {
  if (!options.enabled) {
    return {
      corrected: [...y],
      background: new Array(y.length).fill(0)
    };
  }

  // Default to 'min' method or if explicitly selected
  // In the future, switch(options.method) can handle others
  
  // Simple implementation: Subtract the minimum value found in y
  const minY = Math.min(...y);
  const background = new Array(y.length).fill(minY);
  const corrected = y.map(val => val - minY);

  return {
    corrected,
    background
  };
};