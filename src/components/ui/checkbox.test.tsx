import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from './checkbox';
import { describe, it, expect } from 'vitest';

describe('Checkbox', () => {
  it('toggles state on click', async () => {
    render(<Checkbox aria-label="test-checkbox" />);

    const checkbox = screen.getByRole('checkbox', { name: 'test-checkbox' });
    expect(checkbox).not.toBeChecked();

    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    await userEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });
});
