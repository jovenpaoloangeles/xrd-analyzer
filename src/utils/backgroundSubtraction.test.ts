import { describe, it, expect } from 'vitest';
import { subtractBackground } from './backgroundSubtraction';

describe('subtractBackground', () => {
  it('should return original data when disabled', () => {
    const x = [1, 2, 3];
    const y = [10, 20, 30];
    const result = subtractBackground(x, y, { enabled: false });
    expect(result.corrected).toEqual(y);
    expect(result.background).toEqual([0, 0, 0]);
  });

  it('should subtract background when enabled', () => {
    const x = [0, 1, 2, 3, 4];
    // Baseline = 10. Peak at index 2 = 20.
    const y = [10, 10, 20, 10, 10]; 
    const result = subtractBackground(x, y, { enabled: true });
    
    // Expect corrected peak to be around 10 (20 - 10)
    expect(result.corrected[2]).toBeLessThan(20);
    expect(result.background[0]).toBeGreaterThan(0);
  });
});
