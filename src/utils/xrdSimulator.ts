import { CrystalStructure, AtomSite } from '../types';

/**
 * Simplified XRD profile simulator for Rietveld-style refinement.
 * Calculates theoretical intensity based on crystal structure.
 */
export const simulateXRD = (
  structure: CrystalStructure,
  angles: number[], // 2-theta in degrees
  wavelength: number, // in Angstroms
  scale: number = 1.0
): number[] => {
  const profile = new Array(angles.length).fill(0);
  
  // 1. Determine relevant reflections (hkl) for the given angle range
  // For simplicity in this MVP, we will pre-calculate some common reflections for Cubic/Tetragonal
  // In a full version, we'd iterate over h,k,l based on lattice parameters.
  
  const reflections = generateReflections(structure, angles[0], angles[angles.length - 1], wavelength);
  // console.log(`Generated ${reflections.length} reflections`);

  // 2. For each reflection, calculate position and intensity
  reflections.forEach(ref => {
    const twoTheta = ref.twoTheta;
    const intensity = calculateReflectionIntensity(structure, ref, wavelength) * scale;
    
    // 3. Apply profile function (Gaussian)
    const fwhm = 0.2; // Fixed width for now
    const sigma = fwhm / (2 * Math.sqrt(2 * Math.log(2)));
    
    angles.forEach((angle, i) => {
      const diff = angle - twoTheta;
      const gaussian = (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-(diff * diff) / (2 * sigma * sigma));
      profile[i] += intensity * gaussian;
    });
  });

  return profile;
};

interface Reflection {
  h: number;
  k: number;
  l: number;
  twoTheta: number;
}

const generateReflections = (s: CrystalStructure, min2T: number, max2T: number, lambda: number): Reflection[] => {
  const list: Reflection[] = [];
  const limit = 5; // Search limit for h,k,l
  
  for (let h = -limit; h <= limit; h++) {
    for (let k = -limit; k <= limit; k++) {
      for (let l = -limit; l <= limit; l++) {
        if (h === 0 && k === 0 && l === 0) continue;
        
        // d-spacing for orthogonal systems (simplification)
        const invDSquared = (h * h) / (s.a * s.a) + (k * k) / (s.b * s.b) + (l * l) / (s.c * s.c);
        const d = 1 / Math.sqrt(invDSquared);
        
        const sinTheta = lambda / (2 * d);
        if (sinTheta > 1) continue;
        
        const twoTheta = 2 * Math.asin(sinTheta) * (180 / Math.PI);
        if (twoTheta >= min2T && twoTheta <= max2T) {
          list.push({ h, k, l, twoTheta });
        }
      }
    }
  }
  return list;
};

const calculateReflectionIntensity = (s: CrystalStructure, ref: Reflection, lambda: number): number => {
  // F(hkl) = Sum [ f_j * exp(2*PI*i * (h*xj + k*yj + l*zj)) ]
  let realF = 0;
  let imagF = 0;
  
  s.atoms.forEach(atom => {
    const phase = 2 * Math.PI * (ref.h * atom.x + ref.k * atom.y + ref.l * atom.z);
    const f = getScatteringFactor(atom.symbol); // Simplified
    
    realF += f * atom.occupancy * Math.cos(phase);
    imagF += f * atom.occupancy * Math.sin(phase);
  });
  
  const fSquared = realF * realF + imagF * imagF;
  
  // Lorentz-Polarization factor: (1 + cos^2(2theta)) / (sin^2(theta) * cos(theta))
  const thetaRad = (ref.twoTheta / 2) * (Math.PI / 180);
  const twoThetaRad = ref.twoTheta * (Math.PI / 180);
  const lp = (1 + Math.pow(Math.cos(twoThetaRad), 2)) / (Math.pow(Math.sin(thetaRad), 2) * Math.cos(thetaRad));
  
  return fSquared * lp;
};

const getScatteringFactor = (symbol: string): number => {
  // Dummy values based on atomic number
  const factors: Record<string, number> = {
    'Si': 14,
    'O': 8,
    'Au': 79,
    'Cu': 29,
  };
  return factors[symbol] || 10;
};
