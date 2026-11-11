import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  getWeather,
  searchCities,
  WeatherServiceError,
} from '../../../src/services/weatherService';
import type { City } from '../../../src/types/city';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('getWeather', () => {
  const city: City = {
    id: 1,
    name: 'Recife',
    state: 'Pernambuco',
    countryCode: 'BR',
    latitude: -8.0539,
    longitude: -34.8811,
    timezone: 'America/Recife',
  };
  const dates = ['2026-11-11', '2026-11-12', '2026-11-13', '2026-11-14', '2026-11-15'];

  function mockResponse(data: unknown) {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => data });
    vi.stubGlobal('fetch', fetchMock);
    return fetchMock;
  }

  it('consulta as coordenadas e mapeia o clima atual e cinco dias por índice', async () => {
    const fetchMock = mockResponse({
      current: {
        time: '2026-11-11T09:00',
        temperature_2m: 27.4,
        apparent_temperature: 29.1,
        relative_humidity_2m: 78,
        wind_speed_10m: 12.6,
        precipitation: 0,
        surface_pressure: 1012,
        weather_code: 2,
      },
      daily: {
        time: [...dates, '2026-11-16'],
        temperature_2m_max: [30, 31, 32, 33, 34, 35],
        temperature_2m_min: [20, 21, 22, 23, 24, 25],
        weather_code: [0, 1, 2, 3, 61, 95],
      },
    });
    const before = Date.now();
    const result = await getWeather(city);

    expect(result.city).toBe(city);
    expect(result.fetchedAt).toBeGreaterThanOrEqual(before);
    expect(result.fetchedAt).toBeLessThanOrEqual(Date.now());
    expect(result.current).toEqual({
      temperatureC: 27.4,
      apparentTemperatureC: 29.1,
      relativeHumidityPct: 78,
      windSpeedKmh: 12.6,
      precipitationMm: 0,
      pressureHpa: 1012,
      weatherCode: 2,
      observedAt: '2026-11-11T09:00',
    });
    expect(result.daily).toEqual(
      dates.map((date, index) => ({
        date,
        maxC: 30 + index,
        minC: 20 + index,
        weatherCode: [0, 1, 2, 3, 61][index],
      })),
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const url = new URL(fetchMock.mock.calls[0][0]);
    expect(url.origin + url.pathname).toBe('https://api.open-meteo.com/v1/forecast');
    expect(Object.fromEntries(url.searchParams)).toEqual({
      latitude: '-8.0539',
      longitude: '-34.8811',
      current:
        'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,precipitation,surface_pressure,weather_code',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min',
      forecast_days: '5',
      timezone: 'auto',
      temperature_unit: 'celsius',
      wind_speed_unit: 'kmh',
    });
  });

  it('preserva dados parciais como null sem inventar dias ou valores', async () => {
    mockResponse({
      current: { temperature_2m: 0, weather_code: null },
      daily: { time: dates.slice(0, 2), temperature_2m_max: [30], weather_code: [0, null] },
    });

    const result = await getWeather(city);

    expect(result.current).toEqual({
      temperatureC: 0,
      apparentTemperatureC: null,
      relativeHumidityPct: null,
      windSpeedKmh: null,
      precipitationMm: null,
      pressureHpa: null,
      weatherCode: null,
      observedAt: null,
    });
    expect(result.daily).toEqual([
      { date: dates[0], maxC: 30, minC: null, weatherCode: 0 },
      { date: dates[1], maxC: null, minC: null, weatherCode: null },
    ]);
  });

  it.each([{}, { time: [] }])('retorna previsão vazia sem datas: %j', async (daily) => {
    mockResponse({ current: {}, daily });

    expect((await getWeather(city)).daily).toEqual([]);
  });

  it.each([
    {},
    { current: {} },
    { daily: {} },
    { current: null, daily: {} },
    { current: {}, daily: null },
    { current: [], daily: {} },
    { current: {}, daily: 'inválido' },
    { current: { temperature_2m: '27' }, daily: {} },
    { current: { wind_speed_10m: Number.NaN }, daily: {} },
    { current: { time: 123 }, daily: {} },
    { current: {}, daily: { time: '2026-11-11' } },
    { current: {}, daily: { time: ['2026-02-30'] } },
    { current: {}, daily: { time: dates, temperature_2m_max: '30' } },
    { current: {}, daily: { time: dates, temperature_2m_max: ['30'] } },
    { current: {}, daily: { time: dates, weather_code: [Number.POSITIVE_INFINITY] } },
    null,
  ])('rejeita resposta incompleta ou malformada: %j', async (data) => {
    mockResponse(data);

    await expect(getWeather(city)).rejects.toBeInstanceOf(WeatherServiceError);
  });

  it('lança WeatherServiceError em resposta HTTP não-ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));

    await expect(getWeather(city)).rejects.toBeInstanceOf(WeatherServiceError);
  });
});

describe('searchCities', () => {
  it('retorna lista vazia sem acessar a rede para entrada vazia', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    expect(await searchCities('  ')).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('normaliza e codifica o nome e mapeia apenas cidades brasileiras em ordem', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [
          {
            id: 1,
            name: 'São Paulo',
            admin1: 'São Paulo',
            country_code: 'BR',
            latitude: -23.5,
            longitude: -46.6,
            timezone: 'America/Sao_Paulo',
          },
          {
            id: 2,
            name: 'Outro país',
            country_code: 'PT',
            latitude: 0,
            longitude: 0,
            timezone: 'Europe/Lisbon',
          },
          {
            id: 3,
            name: 'São Paulo',
            country_code: 'BR',
            latitude: -22,
            longitude: -45,
            timezone: 'America/Sao_Paulo',
          },
        ],
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    expect(await searchCities('  São   Paulo & região  ')).toEqual([
      {
        id: 1,
        name: 'São Paulo',
        state: 'São Paulo',
        countryCode: 'BR',
        latitude: -23.5,
        longitude: -46.6,
        timezone: 'America/Sao_Paulo',
      },
      {
        id: 3,
        name: 'São Paulo',
        state: null,
        countryCode: 'BR',
        latitude: -22,
        longitude: -45,
        timezone: 'America/Sao_Paulo',
      },
    ]);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://geocoding-api.open-meteo.com/v1/search?name=Sao%20Paulo%20%26%20regiao&count=10&countryCode=BR&language=pt&format=json',
    );
  });

  it('retorna lista vazia quando não há resultados', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) }));

    expect(await searchCities('Recife')).toEqual([]);
  });

  it('limita os resultados a dez cidades', async () => {
    const results = Array.from({ length: 12 }, (_, id) => ({
      id,
      name: 'Recife',
      country_code: 'BR',
      latitude: 0,
      longitude: 0,
      timezone: 'America/Recife',
    }));
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ results }) }),
    );

    expect((await searchCities('Recife')).map((city) => city.id)).toEqual([
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    ]);
  });

  it('lança WeatherServiceError em resposta HTTP não-ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));

    await expect(searchCities('Recife')).rejects.toBeInstanceOf(WeatherServiceError);
  });
});
