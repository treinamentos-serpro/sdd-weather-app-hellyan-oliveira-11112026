import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useWeather } from '../../../src/hooks/useWeather';
import { mockWeatherData } from '../../../src/mocks/weather';
import {
  getWeather,
  searchCities,
  WeatherServiceError,
} from '../../../src/services/weatherService';
import type { City } from '../../../src/types/city';
import type { WeatherData } from '../../../src/types/weather';

vi.mock('../../../src/services/weatherService', async (importOriginal) => {
  const original = await importOriginal<typeof import('../../../src/services/weatherService')>();
  return { ...original, searchCities: vi.fn(), getWeather: vi.fn() };
});

const city = mockWeatherData.city;
const otherCity: City = { ...city, id: 2, name: 'Olinda' };
const otherWeather: WeatherData = { ...mockWeatherData, city: otherCity };

function deferred<Value>() {
  let resolve!: (value: Value) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<Value>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(searchCities).mockResolvedValue([city, otherCity]);
  vi.mocked(getWeather).mockResolvedValue(mockWeatherData);
});

describe('useWeather', () => {
  it('começa idle e retry sem operação não faz consultas', async () => {
    const { result } = renderHook(() => useWeather());

    expect(result.current).toMatchObject({
      status: 'idle',
      data: null,
      cities: [],
      error: null,
      query: '',
    });
    await act(async () => result.current.retry());
    expect(searchCities).not.toHaveBeenCalled();
    expect(getWeather).not.toHaveBeenCalled();
  });

  it('busca cidades e mantém loading até carregar o clima da primeira', async () => {
    const weather = deferred<WeatherData>();
    vi.mocked(getWeather).mockReturnValue(weather.promise);
    const { result } = renderHook(() => useWeather());
    let search!: Promise<void>;

    await act(async () => {
      search = result.current.search('Recife');
    });

    expect(searchCities).toHaveBeenCalledWith('Recife');
    expect(getWeather).toHaveBeenCalledExactlyOnceWith(city);
    expect(result.current).toMatchObject({
      status: 'loading',
      data: null,
      cities: [city, otherCity],
      error: null,
      query: 'Recife',
    });

    await act(async () => {
      weather.resolve(mockWeatherData);
      await search;
    });
    expect(result.current).toMatchObject({ status: 'success', data: mockWeatherData });
  });

  it('limpa dados anteriores e termina empty sem consultar clima quando não há cidades', async () => {
    const { result } = renderHook(() => useWeather());
    await act(async () => result.current.search('Recife'));
    vi.mocked(searchCities).mockResolvedValue([]);
    vi.mocked(getWeather).mockClear();

    await act(async () => result.current.search('Sem resultado'));

    expect(result.current).toMatchObject({
      status: 'empty',
      data: null,
      cities: [],
      error: null,
      query: 'Sem resultado',
    });
    expect(getWeather).not.toHaveBeenCalled();
  });

  it('seleciona outra cidade sem repetir a busca e preserva query e cidades', async () => {
    const { result } = renderHook(() => useWeather());
    await act(async () => result.current.search('Recife'));
    const weather = deferred<WeatherData>();
    vi.mocked(getWeather).mockReturnValue(weather.promise);
    let selection!: Promise<void>;

    act(() => {
      selection = result.current.selectCity(otherCity);
    });
    expect(result.current).toMatchObject({ status: 'loading', data: null, error: null });

    await act(async () => {
      weather.resolve(otherWeather);
      await selection;
    });
    expect(searchCities).toHaveBeenCalledTimes(1);
    expect(getWeather).toHaveBeenLastCalledWith(otherCity);
    expect(result.current).toMatchObject({
      status: 'success',
      data: otherWeather,
      cities: [city, otherCity],
      query: 'Recife',
    });
  });

  it('expõe erro do serviço e retry repete a última busca limpando o erro', async () => {
    vi.mocked(searchCities).mockRejectedValueOnce(new WeatherServiceError('Falha de rede.'));
    const { result } = renderHook(() => useWeather());

    await act(async () => result.current.search('Recife'));
    expect(result.current).toMatchObject({ status: 'error', error: 'Falha de rede.', data: null });
    expect(getWeather).not.toHaveBeenCalled();

    await act(async () => result.current.retry());
    expect(searchCities).toHaveBeenNthCalledWith(2, 'Recife');
    expect(result.current).toMatchObject({ status: 'success', error: null, data: mockWeatherData });
  });

  it('retry repete toda a busca quando o carregamento automático do clima falha', async () => {
    vi.mocked(getWeather).mockRejectedValueOnce(
      new WeatherServiceError('A requisição demorou demais.'),
    );
    const { result } = renderHook(() => useWeather());

    await act(async () => result.current.search('Recife'));
    expect(result.current).toMatchObject({
      status: 'error',
      error: 'A requisição demorou demais.',
      data: null,
      cities: [city, otherCity],
    });

    await act(async () => result.current.retry());
    expect(searchCities).toHaveBeenCalledTimes(2);
    expect(getWeather).toHaveBeenCalledTimes(2);
    expect(result.current.status).toBe('success');
  });

  it('retry repete a última seleção e bloqueia repetições enquanto pendente', async () => {
    const { result } = renderHook(() => useWeather());
    vi.mocked(getWeather).mockRejectedValueOnce(new Error('Erro interno'));
    await act(async () => result.current.selectCity(otherCity));
    expect(result.current.error).toBe('Não foi possível carregar o clima. Tente novamente.');
    const weather = deferred<WeatherData>();
    vi.mocked(getWeather).mockReturnValue(weather.promise);
    let retry!: Promise<void>;

    await act(async () => {
      retry = result.current.retry();
      await result.current.retry();
    });
    expect(result.current).toMatchObject({ status: 'loading', data: null, error: null });
    expect(getWeather).toHaveBeenCalledTimes(2);
    expect(getWeather).toHaveBeenLastCalledWith(otherCity);
    expect(searchCities).not.toHaveBeenCalled();

    await act(async () => {
      weather.resolve(otherWeather);
      await retry;
    });
    expect(result.current).toMatchObject({ status: 'success', data: otherWeather });
  });

  it('usa mensagem segura para falhas inesperadas na busca', async () => {
    vi.mocked(searchCities).mockRejectedValue(new Error('Erro interno'));
    const { result } = renderHook(() => useWeather());

    await act(async () => result.current.search('Recife'));

    expect(result.current.error).toBe('Não foi possível buscar cidades. Tente novamente.');
    expect(result.current.status).toBe('error');
  });

  it('ignora uma busca antiga antes de iniciar o carregamento do clima', async () => {
    const cities = deferred<City[]>();
    vi.mocked(searchCities).mockReturnValueOnce(cities.promise);
    const { result } = renderHook(() => useWeather());
    let search!: Promise<void>;
    act(() => {
      search = result.current.search('Recife');
    });

    await act(async () => result.current.selectCity(otherCity));
    await act(async () => {
      cities.resolve([city]);
      await search;
    });

    expect(getWeather).toHaveBeenCalledExactlyOnceWith(otherCity);
    expect(result.current.status).toBe('success');
  });

  it.each([
    'resolve',
    'reject',
  ] as const)('ignora %s de clima antigo após uma nova busca vazia', async (outcome) => {
    const weather = deferred<WeatherData>();
    vi.mocked(getWeather).mockReturnValueOnce(weather.promise);
    const { result } = renderHook(() => useWeather());
    let selection!: Promise<void>;
    act(() => {
      selection = result.current.selectCity(city);
    });
    vi.mocked(searchCities).mockResolvedValue([]);
    await act(async () => result.current.search('Outra cidade'));

    await act(async () => {
      if (outcome === 'resolve') weather.resolve(mockWeatherData);
      else weather.reject(new WeatherServiceError('Falha de rede.'));
      await selection;
    });

    expect(result.current).toMatchObject({
      status: 'empty',
      data: null,
      cities: [],
      error: null,
      query: 'Outra cidade',
    });
  });
});
