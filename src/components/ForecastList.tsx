import type { ForecastDay, Unit } from '../types/weather';
import ForecastCard from './ForecastCard';

interface ForecastListProps {
  daily: ForecastDay[];
  unit: Unit;
}

export default function ForecastList({ daily, unit }: ForecastListProps) {
  return (
    <section aria-labelledby="forecast-title">
      <h2 className="mb-4 text-xl font-semibold text-white" id="forecast-title">
        Previsão diária
      </h2>
      {daily.length === 0 ? (
        <p className="text-slate-300">Previsão indisponível para esta cidade.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {daily.map((day, index) => (
            <ForecastCard day={day} index={index} key={day.date} unit={unit} />
          ))}
        </div>
      )}
    </section>
  );
}
