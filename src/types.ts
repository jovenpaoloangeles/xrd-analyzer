export interface XRDData {
  angle: number;
  intensity: number;
}

export interface ProcessedData extends XRDData {
  backgroundSubtracted?: number;
  smoothed?: number;
}

export interface Peak {
  angle: number;
  intensity: number;
  width: number;
  area?: number;
  crystalliteSize?: number;
  fit?: {
    type: 'gaussian' | 'lorentzian' | 'pseudoVoigt';
    params: {
      amplitude: number;
      center: number;
      width: number;
      mixing?: number; // for pseudo-voigt
    };
  };
}

export interface AtomSite {
  label: string;
  symbol: string;
  x: number;
  y: number;
  z: number;
  occupancy: number;
  B_iso?: number;
}

export interface CrystalStructure {
  a: number;
  b: number;
  c: number;
  alpha: number;
  beta: number;
  gamma: number;
  spaceGroup?: string;
  atoms: AtomSite[];
}

export interface DataSet {
  id: string;
  name: string;
  type: 'sample' | 'reference';
  color: string;
  data: ProcessedData[];
  peaks: Peak[];
  visible: boolean;
}

export interface ProcessingParams {
  smoothing: {
    enabled: boolean;
    windowSize: number;
    polynomialOrder: number;
  };
  background: {
    enabled: boolean;
    method: string;
    windowSize: number;
    iterations: number;
  };
  peaks: {
    minHeight: number;
    minDistance: number;
    minProminence: number;
    instrumentBroadening: number; // in degrees 2θ
    wavelength: number; // in Angstroms
    useMinHeight: boolean;
    useMinDistance: boolean;
    useMinProminence: boolean;
  };
  comparison: {
    mode: 'overlay';
    offset: number;
  };
  rietveld: {
    enabled: boolean;
    cifContent?: string;
    refinedIntensity?: number[];
    rwp?: number;
    structure?: CrystalStructure;
  };
}