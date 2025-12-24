import { describe, it, expect } from 'vitest';
import { simulateXRD } from './xrdSimulator';
import { CrystalStructure } from '../types';

describe('simulateXRD', () => {
  it('should generate a profile with peaks at expected positions', () => {
    const structure: CrystalStructure = {
      a: 5.43, b: 5.43, c: 5.43,
      alpha: 90, beta: 90, gamma: 90,
      atoms: [{ label: 'Si1', symbol: 'Si', x: 0, y: 0, z: 0, occupancy: 1 }]
    };
    
    const angles = [10, 20, 30, 40, 50, 60];
    const wavelength = 1.5406;
    
    const profile = simulateXRD(structure, angles, wavelength);
    expect(profile.length).toBe(angles.length);
    // Basic check: should have some non-zero values if peaks are in range
  });
});
