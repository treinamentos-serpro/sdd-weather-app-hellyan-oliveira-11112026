import type { WeatherData } from '../types/weather';

export const mockWeatherData: WeatherData = {
  city: {
    id: 3390760,
    name: 'Recife',
    state: 'Pernambuco',
    countryCode: 'BR',
    latitude: -8.0539,
    longitude: -34.8811,
    timezone: 'America/Recife',
  },
  current: {
    temperatureC: 29,
    apparentTemperatureC: 33,
    relativeHumidityPct: 74,
    windSpeedKmh: 18,
    precipitationMm: 0,
    pressureHpa: 1014,
    weatherCode: 2,
    observedAt: '2026-11-11T14:00',
  },
  daily: [
    { date: '2026-11-11', maxC: 30, minC: 25, weatherCode: 2 },
    { date: '2026-11-12', maxC: 29, minC: 25, weatherCode: 3 },
    { date: '2026-11-13', maxC: 31, minC: 24, weatherCode: 1 },
    { date: '2026-11-14', maxC: 30, minC: 25, weatherCode: 61 },
    { date: '2026-11-15', maxC: 29, minC: 24, weatherCode: 80 },
  ],
  fetchedAt: Date.now(),
};
