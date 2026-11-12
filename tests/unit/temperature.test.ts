import { describe, expect, it } from 'vitest';
import {
  convertTemperature,
  formatTemperature,
  toFahrenheit,
  unitLabel,
} from '../../src/lib/temperature';

describe('temperature', () => {
  describe('toFahrenheit', () => {
    it.each([
      [0, 32],
      [100, 212],
      [-40, -40],
    ])('converts %i °C to %i °F', (celsius, fahrenheit) => {
      expect(toFahrenheit(celsius)).toBe(fahrenheit);
    });
  });

  describe('convertTemperature', () => {
    it('returns the original value for Celsius', () => {
      expect(convertTemperature(23.5, 'celsius')).toBe(23.5);
    });

    it('converts the original Celsius value to Fahrenheit', () => {
      expect(convertTemperature(20.3, 'fahrenheit')).toBeCloseTo(68.54);
    });
  });

  describe('formatTemperature', () => {
    it('rounds Celsius half away from zero and includes its symbol', () => {
      expect(formatTemperature(23.5, 'celsius')).toBe('24 °C');
      expect(formatTemperature(-1.5, 'celsius')).toBe('-2 °C');
    });

    it('converts before rounding and includes the Fahrenheit symbol', () => {
      expect(formatTemperature(20.3, 'fahrenheit')).toBe('69 °F');
    });

    it('returns the unavailable-data label for null', () => {
      expect(formatTemperature(null, 'celsius')).toBe('Dados indisponíveis');
    });
  });

  describe('unitLabel', () => {
    it.each([
      ['celsius', '°C'],
      ['fahrenheit', '°F'],
    ] as const)('returns %s label', (unit, label) => {
      expect(unitLabel(unit)).toBe(label);
    });
  });
});
