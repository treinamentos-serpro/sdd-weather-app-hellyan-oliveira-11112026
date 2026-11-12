import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../../src/App';
import { mockWeatherData } from '../../src/mocks/weather';
import { getWeather, searchCities, WeatherServiceError } from '../../src/services/weatherService';
import type { City } from '../../src/types/city';

vi.mock('../../src/services/weatherService', async (importOriginal) => {
  const original = await importOriginal<typeof import('../../src/services/weatherService')>();
  return { ...original, searchCities: vi.fn(), getWeather: vi.fn() };
});

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(searchCities).mockResolvedValue([mockWeatherData.city]);
  vi.mocked(getWeather).mockResolvedValue(mockWeatherData);
});

describe('App', () => {
  it('começa sem dados e exibe a atribuição em todas as telas', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByText('Busque uma cidade para consultar o clima.')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Recife' })).not.toBeInTheDocument();
    expect(screen.queryByText('Dados de demonstração: Recife.')).not.toBeInTheDocument();
    expect(searchCities).not.toHaveBeenCalled();
    expect(getWeather).not.toHaveBeenCalled();
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
    expect(searchCities).toHaveBeenCalledExactlyOnceWith('recife');
    expect(getWeather).toHaveBeenCalledExactlyOnceWith(mockWeatherData.city);
  });

  it('remove o clima anterior quando uma busca não encontra dados', async () => {
    const user = userEvent.setup();
    render(<App />);
    const input = screen.getByRole('searchbox', { name: 'Nome da cidade' });

    await user.type(input, 'Recife{Enter}');
    expect(await screen.findByRole('heading', { name: 'Recife' })).toBeInTheDocument();
    vi.mocked(searchCities).mockResolvedValueOnce([]);
    await user.clear(input);
    await user.type(input, 'Olinda{Enter}');

    expect(
      await screen.findByRole('heading', { name: 'Nenhuma cidade encontrada.' }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Recife' })).not.toBeInTheDocument();
  });

  it('mostra carregamento e permite repetir uma busca que falhou', async () => {
    let rejectSearch: (reason?: unknown) => void = () => {};
    vi.mocked(searchCities)
      .mockImplementationOnce(
        () =>
          new Promise<City[]>((_, reject) => {
            rejectSearch = reject;
          }),
      )
      .mockResolvedValueOnce([mockWeatherData.city]);
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole('searchbox', { name: 'Nome da cidade' }), 'Recife{Enter}');
    expect(screen.getByRole('status')).toHaveTextContent('Buscando clima...');

    await act(async () => rejectSearch(new Error('Falha')));
    expect(screen.getByRole('alert')).toHaveTextContent('Não foi possível buscar cidades.');
    await user.click(screen.getByRole('button', { name: 'tentar novamente' }));

    expect(await screen.findByRole('heading', { name: 'Recife' })).toBeInTheDocument();
    expect(searchCities).toHaveBeenLastCalledWith('Recife');
    expect(searchCities).toHaveBeenCalledTimes(2);
    expect(getWeather).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('ignora respostas de buscas anteriores', async () => {
    let resolveFirst: (cities: City[]) => void = () => {};
    vi.mocked(searchCities)
      .mockImplementationOnce(
        () =>
          new Promise<City[]>((resolve) => {
            resolveFirst = resolve;
          }),
      )
      .mockResolvedValueOnce([]);
    render(<App />);
    const input = screen.getByRole('searchbox', { name: 'Nome da cidade' });

    fireEvent.change(input, { target: { value: 'Recife' } });
    fireEvent.submit(input.closest('form')!);
    fireEvent.change(input, { target: { value: 'Olinda' } });
    fireEvent.submit(input.closest('form')!);
    expect(
      await screen.findByRole('heading', { name: 'Nenhuma cidade encontrada.' }),
    ).toBeInTheDocument();

    await act(async () => resolveFirst([mockWeatherData.city]));
    expect(screen.queryByRole('heading', { name: 'Recife' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Nenhuma cidade encontrada.' })).toBeInTheDocument();
    expect(getWeather).not.toHaveBeenCalled();
  });

  it('exibe o erro do clima e repete a operação pelo hook mantendo a unidade', async () => {
    vi.mocked(getWeather).mockRejectedValueOnce(
      new WeatherServiceError('A requisição demorou demais.'),
    );
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Graus Fahrenheit' }));
    await user.type(screen.getByRole('searchbox', { name: 'Nome da cidade' }), 'Recife{Enter}');

    expect(await screen.findByRole('alert')).toHaveTextContent('A requisição demorou demais.');
    expect(screen.queryByRole('region', { name: 'Recife' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'tentar novamente' }));

    const currentWeather = await screen.findByRole('region', { name: 'Recife' });
    expect(within(currentWeather).getByText('84 °F')).toBeInTheDocument();
    expect(searchCities).toHaveBeenCalledTimes(2);
    expect(getWeather).toHaveBeenCalledTimes(2);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
