import { describe, it, expect } from 'vitest';
import { calculateWaterfallOffset } from './dataProcessing';

describe('calculateWaterfallOffset', () => {
  it('should return 0 when mode is overlay', () => {
    expect(calculateWaterfallOffset(0, 50, 'overlay')).toBe(0);
    expect(calculateWaterfallOffset(1, 50, 'overlay')).toBe(0);
    expect(calculateWaterfallOffset(5, 100, 'overlay')).toBe(0);
  });

  it('should return index * offset when mode is waterfall', () => {
    expect(calculateWaterfallOffset(0, 50, 'waterfall')).toBe(0);
    expect(calculateWaterfallOffset(1, 50, 'waterfall')).toBe(50);
    expect(calculateWaterfallOffset(2, 50, 'waterfall')).toBe(100);
    expect(calculateWaterfallOffset(3, 10, 'waterfall')).toBe(30);
  });
});
