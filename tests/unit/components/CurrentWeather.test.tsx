import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CurrentWeather from '../../../src/components/CurrentWeather';
import { mockWeatherData } from '../../../src/mocks/weather';

describe('CurrentWeather', () => {
  it('exibe o clima atual, métricas e a temperatura na unidade recebida', () => {
    const { city, current } = mockWeatherData;
    const { rerender } = render(<CurrentWeather city={city} current={current} unit="celsius" />);

    expect(screen.getByRole('heading', { name: 'Recife' })).toBeInTheDocument();
    expect(screen.getByText('29 °C')).toBeInTheDocument();
    expect(screen.getByText('Parcialmente nublado')).toBeInTheDocument();
    expect(screen.getByText('74 %')).toBeInTheDocument();
    expect(screen.getByText('18 km/h')).toBeInTheDocument();
    expect(screen.getByText('0 mm')).toBeInTheDocument();
    expect(screen.getByText('1.014 hPa')).toBeInTheDocument();
    expect(screen.getByText('Atualizado às 14:00')).toBeInTheDocument();

    rerender(<CurrentWeather city={city} current={current} unit="fahrenheit" />);
    expect(screen.getByText('84 °F')).toBeInTheDocument();
  });

  it('apresenta fallback para valores ausentes e códigos meteorológicos desconhecidos', () => {
    const { city, current } = mockWeatherData;
    render(
      <CurrentWeather
        city={city}
        current={{
          ...current,
          precipitationMm: null,
          pressureHpa: null,
          temperatureC: null,
          weatherCode: 999,
        }}
        unit="celsius"
      />,
    );

    expect(screen.getByText('Condição desconhecida')).toBeInTheDocument();
    expect(screen.getAllByText('Dados indisponíveis')).toHaveLength(3);
  });
});
