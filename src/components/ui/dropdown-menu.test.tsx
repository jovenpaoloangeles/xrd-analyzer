import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from './dropdown-menu';
import { describe, it, expect } from 'vitest';

describe('DropdownMenu', () => {
  it('opens and shows items on click', async () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Label</DropdownMenuLabel>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
          <DropdownMenuItem>Item 2</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    const trigger = screen.getByText('Open Menu');
    expect(trigger).toBeInTheDocument();
    
    // Content shouldn't be visible yet
    expect(screen.queryByText('Item 1')).not.toBeInTheDocument();

    await userEvent.click(trigger);

    // Wait for content
    await waitFor(() => {
        expect(screen.getByText('Item 1')).toBeInTheDocument();
        expect(screen.getByText('My Label')).toBeInTheDocument();
    });
  });
});
