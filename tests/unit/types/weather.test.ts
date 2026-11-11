import { describe, expect, it } from 'vitest';
import { mockWeatherData } from '../../../src/mocks/weather';

describe('mockWeatherData', () => {
  it('fornece uma cidade com clima atual e cinco dias em ordem cronológica', () => {
    expect(mockWeatherData.city.name).toBe('Recife');
    expect(mockWeatherData.current.temperatureC).toBe(29);
    expect(mockWeatherData.daily).toHaveLength(5);
    expect(mockWeatherData.daily.map(({ date }) => date)).toEqual([
      '2026-11-11',
      '2026-11-12',
      '2026-11-13',
      '2026-11-14',
      '2026-11-15',
    ]);
  });
});
