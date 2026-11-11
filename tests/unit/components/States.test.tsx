import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import EmptyState from '../../../src/components/states/EmptyState';
import ErrorState from '../../../src/components/states/ErrorState';
import LoadingState from '../../../src/components/states/LoadingState';

describe('componentes de estado', () => {
  it('anuncia o carregamento com role status', () => {
    render(<LoadingState />);

    expect(screen.getByRole('status')).toHaveTextContent('Carregando...');
  });

  it('anuncia o erro e executa a nova tentativa', () => {
    const onRetry = vi.fn();
    render(<ErrorState message="Não foi possível carregar o clima." onRetry={onRetry} />);

    expect(screen.getByRole('alert')).toHaveTextContent('Não foi possível carregar o clima.');
    fireEvent.click(screen.getByRole('button', { name: 'tentar novamente' }));

    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('desabilita a nova tentativa enquanto ela está pendente', () => {
    render(<ErrorState isRetrying message="Falha na busca." onRetry={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'tentar novamente' })).toBeDisabled();
  });

  it('exibe o título e a dica do estado vazio', () => {
    render(<EmptyState hint="Tente buscar outra cidade." title="Nenhum resultado" />);

    expect(screen.getByRole('heading', { name: 'Nenhum resultado' })).toBeInTheDocument();
    expect(screen.getByText('Tente buscar outra cidade.')).toBeInTheDocument();
  });
});
