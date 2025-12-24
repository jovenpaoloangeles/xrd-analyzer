import { describe, it, expect } from 'vitest';
import { smoothSignal } from './smoothing';

describe('smoothSignal', () => {
  it('should return original data when disabled', () => {
    const y = [10, 20, 30, 40, 50];
    const result = smoothSignal(y, { enabled: false });
    expect(result).toEqual(y);
  });

  it('should smooth data when enabled', () => {
    // Noisy constant signal around 10
    const y = [10, 15, 5, 15, 5, 10]; 
    const result = smoothSignal(y, { enabled: true, windowSize: 5, polynomial: 2 });
    
    expect(result).not.toEqual(y);
    expect(result.length).toEqual(y.length);
    // The variance should ideally decrease, but checking inequality is enough for a unit test "Red" phase
  });
});
