import type { City } from './city';

export type { City } from './city';

export type Unit = 'celsius' | 'fahrenheit';

export interface CurrentWeather {
  temperatureC: number | null;
  apparentTemperatureC: number | null;
  relativeHumidityPct: number | null;
  windSpeedKmh: number | null;
  precipitationMm: number | null;
  pressureHpa: number | null;
  weatherCode: number | null;
  observedAt: string | null;
}

export interface ForecastDay {
  date: string;
  maxC: number | null;
  minC: number | null;
  weatherCode: number | null;
  precipitationProbabilityPct?: number | null;
}

export interface WeatherData {
  city: City;
  current: CurrentWeather;
  daily: ForecastDay[];
  fetchedAt: number;
}

export type SearchState =
  | { status: 'idle' }
  | { status: 'validation_error'; message: string }
  | { status: 'loading'; term: string }
  | { status: 'success'; term: string; cities: City[] }
  | { status: 'empty'; term: string }
  | { status: 'error'; term: string };

export type WeatherState =
  | { status: 'idle' }
  | { status: 'loading'; city: City }
  | { status: 'success'; report: WeatherData }
  | { status: 'error'; city: City };
