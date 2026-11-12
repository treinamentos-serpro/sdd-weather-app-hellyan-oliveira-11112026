import type { Unit } from '../types/weather';

export function toFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

export function convertTemperature(celsius: number, unit: Unit): number {
  return unit === 'fahrenheit' ? toFahrenheit(celsius) : celsius;
}

export function unitLabel(unit: Unit): string {
  return unit === 'fahrenheit' ? '°F' : '°C';
}

export function formatTemperature(valueC: number | null, unit: Unit): string {
  if (valueC === null) {
    return 'Dados indisponíveis';
  }

  const value = convertTemperature(valueC, unit);
  const rounded = Math.sign(value) * Math.floor(Math.abs(value) + 0.5);
  const normalized = Object.is(rounded, -0) ? 0 : rounded;

  return `${normalized} ${unitLabel(unit)}`;
}
