import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './tooltip';
import { describe, it, expect } from 'vitest';

describe('Tooltip', () => {
  it('renders trigger and shows content on hover', async () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    const trigger = screen.getByText('Hover me');
    expect(trigger).toBeInTheDocument();

    // Content should not be visible initially
    expect(screen.queryByText('Tooltip content')).not.toBeInTheDocument();

    // Hover
    await userEvent.hover(trigger);

    // Wait for content to appear (Radix has a default delay)
    await waitFor(() => {
      const tooltipContent = screen.getAllByText('Tooltip content');
      expect(tooltipContent[0]).toBeInTheDocument();
    });
  });
});
