import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ForecastList from '../../../src/components/ForecastList';
import { mockWeatherData } from '../../../src/mocks/weather';

describe('ForecastList', () => {
  it('exibe os dias, condições, chuva e temperaturas na unidade selecionada', () => {
    const daily = mockWeatherData.daily.map((day, index) => ({
      ...day,
      precipitationProbabilityPct: index === 0 ? 40 : null,
    }));
    const { rerender } = render(<ForecastList daily={daily} unit="celsius" />);

    expect(screen.getAllByRole('article')).toHaveLength(5);
    const first = screen.getAllByRole('article')[0];
    expect(within(first).getByRole('heading', { name: 'Hoje, 11/11' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Qui., 12/11' })).toBeInTheDocument();
    expect(within(first).getByText('Parcialmente nublado')).toBeInTheDocument();
    expect(within(first).getByText('30 °C')).toBeInTheDocument();
    expect(within(first).getByText('25 °C')).toBeInTheDocument();
    expect(within(first).getByText('40 %')).toBeInTheDocument();

    rerender(<ForecastList daily={daily} unit="fahrenheit" />);
    expect(within(first).getByText('86 °F')).toBeInTheDocument();
    expect(within(first).getByText('77 °F')).toBeInTheDocument();
  });

  it('apresenta dados ausentes sem ocultar os demais campos', () => {
    render(
      <ForecastList
        daily={[{ date: '2026-11-11', maxC: null, minC: 20, weatherCode: null }]}
        unit="celsius"
      />,
    );

    expect(screen.getAllByText('Dados indisponíveis')).toHaveLength(3);
    expect(screen.getByText('20 °C')).toBeInTheDocument();
  });

  it('apresenta mensagem quando não há previsão', () => {
    render(<ForecastList daily={[]} unit="celsius" />);

    expect(screen.getByText('Previsão indisponível para esta cidade.')).toBeInTheDocument();
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
  });
});
