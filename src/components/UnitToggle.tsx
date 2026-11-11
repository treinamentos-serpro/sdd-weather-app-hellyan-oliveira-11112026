import type { Unit } from '../types/weather';

interface UnitToggleProps {
  unit: Unit;
  onChange: (unit: Unit) => void;
}

export default function UnitToggle({ unit, onChange }: UnitToggleProps) {
  return (
    <div
      aria-label="Unidade de temperatura"
      className="inline-flex rounded-xl border border-white/10 bg-white/5 p-1 shadow-glass backdrop-blur-md"
      role="group"
    >
      <button
        aria-label="Graus Celsius"
        aria-pressed={unit === 'celsius'}
        className={`min-h-11 min-w-11 rounded-lg px-3 font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${unit === 'celsius' ? 'bg-accent-500 text-night-900' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
        onClick={() => onChange('celsius')}
        type="button"
      >
        °C
      </button>
      <button
        aria-label="Graus Fahrenheit"
        aria-pressed={unit === 'fahrenheit'}
        className={`min-h-11 min-w-11 rounded-lg px-3 font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${unit === 'fahrenheit' ? 'bg-accent-500 text-night-900' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
        onClick={() => onChange('fahrenheit')}
        type="button"
      >
        °F
      </button>
    </div>
  );
}
