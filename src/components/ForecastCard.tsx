import { forecastDayLabel } from '../lib/format';
import { formatTemperature } from '../lib/temperature';
import { describeWeatherCode } from '../lib/weatherCodes';
import type { ForecastDay, Unit } from '../types/weather';
import WeatherGlyph from './WeatherGlyph';

interface ForecastCardProps {
  day: ForecastDay;
  index: number;
  unit: Unit;
}

export default function ForecastCard({ day, index, unit }: ForecastCardProps) {
  const condition = describeWeatherCode(day.weatherCode);
  const probability = day.precipitationProbabilityPct;

  return (
    <article className="min-w-0 rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-md">
      <h3 className="font-semibold text-white">{forecastDayLabel(day.date, index)}</h3>
      <WeatherGlyph iconKey={condition.iconKey} />
      <p className="text-sm text-slate-200">{condition.label}</p>
      <dl className="mt-3 space-y-1 text-sm text-slate-300">
        <div>
          <dt className="inline">Máxima: </dt>
          <dd className="inline">{formatTemperature(day.maxC, unit)}</dd>
        </div>
        <div>
          <dt className="inline">Mínima: </dt>
          <dd className="inline">{formatTemperature(day.minC, unit)}</dd>
        </div>
        <div>
          <dt className="inline">Probabilidade de chuva: </dt>
          <dd className="inline">
            {probability == null ? 'Dados indisponíveis' : `${Math.round(probability)} %`}
          </dd>
        </div>
      </dl>
    </article>
  );
}
