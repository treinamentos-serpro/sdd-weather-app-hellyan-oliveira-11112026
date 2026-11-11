import type { Unit } from '../types/weather';

export function toFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

export function formatTemperature(valueC: number | null, unit: Unit): string {
  if (valueC === null) {
    return 'Dados indisponíveis';
  }

  const value = unit === 'fahrenheit' ? toFahrenheit(valueC) : valueC;
  const rounded = Math.sign(value) * Math.floor(Math.abs(value) + 0.5);
  const normalized = Object.is(rounded, -0) ? 0 : rounded;
  const suffix = unit === 'fahrenheit' ? '°F' : '°C';

  return `${normalized} ${suffix}`;
}
