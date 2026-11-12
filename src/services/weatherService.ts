import type { City } from '../types/city';
import type { WeatherData } from '../types/weather';

interface GeocodingResult {
  id: number;
  name: string;
  admin1?: string;
  country_code: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

interface GeocodingResponse {
  results?: GeocodingResult[];
}

export class WeatherServiceError extends Error {
  constructor(message = 'Não foi possível buscar cidades.') {
    super(message);
    this.name = 'WeatherServiceError';
  }
}

async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    return await fetch(url, { signal: controller.signal });
  } catch (error) {
    throw new WeatherServiceError(
      typeof error === 'object' && error !== null && 'name' in error && error.name === 'AbortError'
        ? 'A requisição demorou demais.'
        : 'Falha de rede.',
    );
  } finally {
    clearTimeout(timeout);
  }
}

function forecastRecord(value: unknown): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new WeatherServiceError('Resposta de clima incompleta ou inválida.');
  }
  return value as Record<string, unknown>;
}

function forecastNumber(value: unknown): number | null {
  if (value === undefined || value === null) return null;
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new WeatherServiceError('Resposta de clima inválida.');
  }
  return value;
}

function forecastArray(value: unknown): unknown[] {
  if (value === undefined) return [];
  if (!Array.isArray(value)) {
    throw new WeatherServiceError('Resposta de clima inválida.');
  }
  return value;
}

export async function getWeather(city: City): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    current:
      'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,precipitation,surface_pressure,weather_code',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min',
    forecast_days: '5',
    timezone: 'auto',
    temperature_unit: 'celsius',
    wind_speed_unit: 'kmh',
  });
  const response = await fetchWithTimeout(`https://api.open-meteo.com/v1/forecast?${params}`);

  if (!response.ok) {
    throw new WeatherServiceError('Não foi possível buscar o clima.');
  }

  const data = forecastRecord(await response.json());
  const current = forecastRecord(data.current);
  const daily = forecastRecord(data.daily);
  const dates = forecastArray(daily.time);
  const maxValues = forecastArray(daily.temperature_2m_max);
  const minValues = forecastArray(daily.temperature_2m_min);
  const codes = forecastArray(daily.weather_code);

  if (current.time != null && typeof current.time !== 'string') {
    throw new WeatherServiceError('Resposta de clima inválida.');
  }

  return {
    city,
    fetchedAt: Date.now(),
    current: {
      temperatureC: forecastNumber(current.temperature_2m),
      apparentTemperatureC: forecastNumber(current.apparent_temperature),
      relativeHumidityPct: forecastNumber(current.relative_humidity_2m),
      windSpeedKmh: forecastNumber(current.wind_speed_10m),
      precipitationMm: forecastNumber(current.precipitation),
      pressureHpa: forecastNumber(current.surface_pressure),
      weatherCode: forecastNumber(current.weather_code),
      observedAt: current.time ?? null,
    },
    daily: dates.slice(0, 5).map((date, index) => {
      if (
        typeof date !== 'string' ||
        !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
        !Number.isFinite(Date.parse(date)) ||
        new Date(date).toISOString().slice(0, 10) !== date
      ) {
        throw new WeatherServiceError('Resposta de clima inválida.');
      }
      return {
        date,
        maxC: forecastNumber(maxValues[index]),
        minC: forecastNumber(minValues[index]),
        weatherCode: forecastNumber(codes[index]),
      };
    }),
  };
}

export async function searchCities(name: string): Promise<City[]> {
  const normalizedName = name
    .trim()
    .replace(/\s+/g, ' ')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  if (!normalizedName) {
    return [];
  }

  const response = await fetchWithTimeout(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(normalizedName)}&count=10&countryCode=BR&language=pt&format=json`,
  );

  if (!response.ok) {
    throw new WeatherServiceError();
  }

  const data: GeocodingResponse = await response.json();
  return (data.results ?? [])
    .filter((result) => result.country_code === 'BR')
    .slice(0, 10)
    .map((result) => ({
      id: result.id,
      name: result.name,
      state: result.admin1 ?? null,
      countryCode: 'BR',
      latitude: result.latitude,
      longitude: result.longitude,
      timezone: result.timezone,
    }));
}
