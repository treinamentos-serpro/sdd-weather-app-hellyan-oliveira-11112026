import { formatTemperature } from '../lib/temperature';
import { describeWeatherCode } from '../lib/weatherCodes';
import type { City } from '../types/city';
import type { CurrentWeather as CurrentWeatherData, Unit } from '../types/weather';
import WeatherGlyph from './WeatherGlyph';

interface CurrentWeatherProps {
  city: City;
  current: CurrentWeatherData;
  unit: Unit;
}

function formatMetric(value: number | null, unit: string, fractionDigits = 0): string {
  if (value === null) {
    return 'Dados indisponíveis';
  }

  const formatted = new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: 0,
  }).format(value);

  return `${formatted} ${unit}`;
}

function observedTime(value: string | null): string {
  if (value === null) {
    return 'Dados indisponíveis';
  }

  return value.match(/(?:T|^)(\d{2}:\d{2})/)?.[1] ?? 'Dados indisponíveis';
}

export default function CurrentWeather({ city, current, unit }: CurrentWeatherProps) {
  const condition = describeWeatherCode(current.weatherCode);
  const metrics = [
    { label: 'Sensação térmica', value: formatTemperature(current.apparentTemperatureC, unit) },
    { label: 'Umidade', value: formatMetric(current.relativeHumidityPct, '%') },
    { label: 'Vento', value: formatMetric(current.windSpeedKmh, 'km/h') },
    { label: 'Precipitação', value: formatMetric(current.precipitationMm, 'mm', 1) },
    { label: 'Pressão', value: formatMetric(current.pressureHpa, 'hPa') },
  ];

  return (
    <section
      aria-labelledby="current-weather-title"
      className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-glass backdrop-blur-md sm:p-8"
    >
      <header className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h2 className="break-words text-xl font-semibold text-white" id="current-weather-title">
            {city.name}
          </h2>
          <p className="break-words text-sm text-slate-300">
            {city.state ?? 'Estado não informado'}
          </p>
        </div>
        <p className="text-sm text-slate-400 sm:text-right">
          Atualizado às {observedTime(current.observedAt)}
        </p>
      </header>

      <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
        <WeatherGlyph className="h-16 w-16 sm:h-28 sm:w-28" iconKey={condition.iconKey} />
        <div>
          <p className="text-5xl font-semibold leading-none text-white sm:text-7xl">
            {formatTemperature(current.temperatureC, unit)}
          </p>
          <p className="mt-3 text-lg text-slate-200">{condition.label}</p>
        </div>
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {metrics.map(({ label, value }) => (
          <div
            className="min-w-0 rounded-xl border border-white/10 bg-night-900/40 p-4"
            key={label}
          >
            <dt className="text-sm text-slate-400">{label}</dt>
            <dd className="mt-2 break-words font-medium text-white">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
