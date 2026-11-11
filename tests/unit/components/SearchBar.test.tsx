import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import SearchBar from '../../../src/components/SearchBar';

describe('SearchBar', () => {
  it('has an accessible search landmark and labeled input', () => {
    render(<SearchBar onSearch={vi.fn()} />);

    expect(screen.getByRole('search', { name: 'Buscar cidade' })).toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: 'Nome da cidade' })).toBeInTheDocument();
  });

  it('does not search when the submitted input is empty or whitespace', () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);
    const input = screen.getByRole('searchbox', { name: 'Nome da cidade' });

    fireEvent.submit(input.closest('form')!);
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.submit(input.closest('form')!);

    expect(onSearch).not.toHaveBeenCalled();
  });

  it('submits the trimmed city on Enter or button activation', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);
    const input = screen.getByRole('searchbox', { name: 'Nome da cidade' });

    await user.type(input, '  Recife  ');
    await user.keyboard('{Enter}');
    expect(onSearch).toHaveBeenLastCalledWith('Recife');

    await user.clear(input);
    await user.type(input, '  Olinda  ');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));
    expect(onSearch).toHaveBeenLastCalledWith('Olinda');
    expect(onSearch).toHaveBeenCalledTimes(2);
  });

  it('disables the input and submit button when disabled', () => {
    render(<SearchBar disabled onSearch={vi.fn()} />);

    expect(screen.getByRole('searchbox', { name: 'Nome da cidade' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Buscar' })).toBeDisabled();
  });
});
