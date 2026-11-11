import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import UnitToggle from '../../../src/components/UnitToggle';

describe('UnitToggle', () => {
  it('exposes the selected unit in an accessible button group', () => {
    render(<UnitToggle onChange={vi.fn()} unit="celsius" />);

    const group = screen.getByRole('group', { name: 'Unidade de temperatura' });
    expect(within(group).getByRole('button', { name: 'Graus Celsius' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(within(group).getByRole('button', { name: 'Graus Fahrenheit' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('changes the selected unit with keyboard activation and click', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(<UnitToggle onChange={onChange} unit="celsius" />);
    const group = screen.getByRole('group', { name: 'Unidade de temperatura' });
    const celsiusButton = within(group).getByRole('button', { name: 'Graus Celsius' });
    const fahrenheitButton = within(group).getByRole('button', { name: 'Graus Fahrenheit' });

    await user.tab();
    expect(celsiusButton).toHaveFocus();
    await user.tab();
    expect(fahrenheitButton).toHaveFocus();
    await user.keyboard(' ');
    expect(onChange).toHaveBeenLastCalledWith('fahrenheit');

    rerender(<UnitToggle onChange={onChange} unit="fahrenheit" />);
    expect(screen.getByRole('button', { name: 'Graus Fahrenheit' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Graus Celsius' }));
    expect(onChange).toHaveBeenLastCalledWith('celsius');
  });
});
