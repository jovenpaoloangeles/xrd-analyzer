import { CrystalStructure, AtomSite } from '../types';

export const parseCIF = (content: string): CrystalStructure => {
  const structure: CrystalStructure = {
    a: 0, b: 0, c: 0,
    alpha: 90, beta: 90, gamma: 90,
    atoms: []
  };

  const lines = content.split(/\r?\n/);
  let currentLoop: string[] = [];
  let inLoop = false;

  const getValue = (val: string) => {
    // Remove uncertainties like 5.430(2)
    const clean = val.replace(/\(.*?\)/, '');
    return parseFloat(clean);
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('#')) continue;

    if (line.startsWith('loop_')) {
      inLoop = true;
      currentLoop = [];
      continue;
    }

    if (inLoop) {
      if (line.startsWith('_')) {
        currentLoop.push(line);
      } else {
        // Data line in loop
        const values = line.split(/\s+/);
        if (values.length >= currentLoop.length) {
          const atom: Partial<AtomSite> = {};
          currentLoop.forEach((tag, idx) => {
            const val = values[idx];
            if (tag === '_atom_site_label') atom.label = val;
            if (tag === '_atom_site_type_symbol') atom.symbol = val;
            if (tag === '_atom_site_fract_x') atom.x = getValue(val);
            if (tag === '_atom_site_fract_y') atom.y = getValue(val);
            if (tag === '_atom_site_fract_z') atom.z = getValue(val);
            if (tag === '_atom_site_occupancy') atom.occupancy = getValue(val);
          });
          if (atom.label) structure.atoms.push(atom as AtomSite);
        }
        // If next line doesn't start with _, it's another data line.
        // If it starts with _, but we already have values, it might be a new loop or a single tag.
        // Simplification: assume one data line per atom for now.
      }
    } else {
      if (line.startsWith('_cell_length_a')) structure.a = getValue(line.split(/\s+/)[1]);
      if (line.startsWith('_cell_length_b')) structure.b = getValue(line.split(/\s+/)[1]);
      if (line.startsWith('_cell_length_c')) structure.c = getValue(line.split(/\s+/)[1]);
      if (line.startsWith('_cell_angle_alpha')) structure.alpha = getValue(line.split(/\s+/)[1]);
      if (line.startsWith('_cell_angle_beta')) structure.beta = getValue(line.split(/\s+/)[1]);
      if (line.startsWith('_cell_angle_gamma')) structure.gamma = getValue(line.split(/\s+/)[1]);
      if (line.startsWith('_symmetry_space_group_name_H-M')) {
          structure.spaceGroup = line.replace('_symmetry_space_group_name_H-M', '').trim().replace(/'/g, '');
      }
    }
  }

  return structure;
};
