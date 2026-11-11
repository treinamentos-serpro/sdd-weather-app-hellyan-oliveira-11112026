import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import App from '../../src/App';
import { mockWeatherData } from '../../src/mocks/weather';
import type { WeatherData } from '../../src/types/weather';

describe('App', () => {
  it('começa sem dados e exibe a atribuição em todas as telas', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByText('Busque uma cidade para consultar o clima.')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Recife' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Open-Meteo' })).toHaveAttribute(
      'href',
      'https://open-meteo.com/',
    );

    await user.type(screen.getByRole('searchbox', { name: 'Nome da cidade' }), 'recife');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(await screen.findByRole('heading', { name: 'Recife' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Open-Meteo' })).toBeInTheDocument();
    const currentWeather = within(screen.getByRole('region', { name: 'Recife' }));
    expect(currentWeather.getByText('29 °C')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Graus Fahrenheit' }));
    expect(currentWeather.getByText('84 °F')).toBeInTheDocument();
    expect(
      within(screen.getByRole('region', { name: 'Previsão diária' })).getAllByText('86 °F').length,
    ).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: 'Graus Fahrenheit' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(mockWeatherData.current.temperatureC).toBe(29);
  });

  it('remove o clima anterior quando uma busca não encontra dados', async () => {
    const user = userEvent.setup();
    render(<App />);
    const input = screen.getByRole('searchbox', { name: 'Nome da cidade' });

    await user.type(input, 'Recife{Enter}');
    expect(await screen.findByRole('heading', { name: 'Recife' })).toBeInTheDocument();
    await user.clear(input);
    await user.type(input, 'Olinda{Enter}');

    expect(
      await screen.findByRole('heading', { name: 'Nenhuma cidade encontrada.' }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Recife' })).not.toBeInTheDocument();
  });

  it('mostra carregamento e permite repetir uma busca que falhou', async () => {
    let rejectSearch: (reason?: unknown) => void = () => {};
    const searchWeather = vi
      .fn()
      .mockImplementationOnce(
        () =>
          new Promise<WeatherData | null>((_, reject) => {
            rejectSearch = reject;
          }),
      )
      .mockResolvedValueOnce(mockWeatherData);
    const user = userEvent.setup();
    render(<App searchWeather={searchWeather} />);

    await user.type(screen.getByRole('searchbox', { name: 'Nome da cidade' }), 'Recife{Enter}');
    expect(screen.getByRole('status')).toHaveTextContent('Buscando clima...');

    await act(async () => rejectSearch(new Error('Falha')));
    expect(screen.getByRole('alert')).toHaveTextContent('Não foi possível carregar o clima.');
    await user.click(screen.getByRole('button', { name: 'tentar novamente' }));

    expect(await screen.findByRole('heading', { name: 'Recife' })).toBeInTheDocument();
    expect(searchWeather).toHaveBeenLastCalledWith('Recife');
    expect(searchWeather).toHaveBeenCalledTimes(2);
  });

  it('ignora respostas de buscas anteriores', async () => {
    let resolveFirst: (report: WeatherData | null) => void = () => {};
    const searchWeather = vi
      .fn()
      .mockImplementationOnce(
        () =>
          new Promise<WeatherData | null>((resolve) => {
            resolveFirst = resolve;
          }),
      )
      .mockResolvedValueOnce(null);
    render(<App searchWeather={searchWeather} />);
    const input = screen.getByRole('searchbox', { name: 'Nome da cidade' });

    fireEvent.change(input, { target: { value: 'Recife' } });
    fireEvent.submit(input.closest('form')!);
    fireEvent.change(input, { target: { value: 'Olinda' } });
    fireEvent.submit(input.closest('form')!);
    expect(
      await screen.findByRole('heading', { name: 'Nenhuma cidade encontrada.' }),
    ).toBeInTheDocument();

    await act(async () => resolveFirst(mockWeatherData));
    expect(screen.queryByRole('heading', { name: 'Recife' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Nenhuma cidade encontrada.' })).toBeInTheDocument();
  });
});
