import { describe, it, expect } from 'vitest';
import { parseCIF } from './cifParser';

describe('parseCIF', () => {
  it('should parse a simple CIF file', () => {
    const cifContent = `
data_test
_cell_length_a 5.430
_cell_length_b 5.430
_cell_length_c 5.430
_cell_angle_alpha 90
_cell_angle_beta 90
_cell_angle_gamma 90
_symmetry_space_group_name_H-M 'F m -3 m'

loop_
_atom_site_label
_atom_site_type_symbol
_atom_site_fract_x
_atom_site_fract_y
_atom_site_fract_z
_atom_site_occupancy
Si Si 0.00000 0.00000 0.00000 1.0
    `;

    const result = parseCIF(cifContent);
    expect(result.a).toBe(5.430);
    expect(result.alpha).toBe(90);
    expect(result.atoms.length).toBe(1);
    expect(result.atoms[0].symbol).toBe('Si');
    expect(result.atoms[0].x).toBe(0);
  });
});
