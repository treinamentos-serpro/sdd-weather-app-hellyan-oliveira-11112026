import { useState } from 'react';
import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';
import SearchBar from './components/SearchBar';
import EmptyState from './components/states/EmptyState';
import ErrorState from './components/states/ErrorState';
import LoadingState from './components/states/LoadingState';
import UnitToggle from './components/UnitToggle';
import { useWeather } from './hooks/useWeather';
import type { Unit } from './types/weather';

export default function App() {
  const [unit, setUnit] = useState<Unit>('celsius');
  const { status, data, error, search, retry } = useWeather();

  return (
    <div className="min-h-screen bg-night-900 font-sans text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-5 border-b border-white/10 py-6 sm:flex-row sm:items-center sm:gap-6">
          <h1 className="shrink-0 text-xl font-bold text-white">Weather App</h1>
          <SearchBar onSearch={search} />
          <UnitToggle onChange={setUnit} unit={unit} />
        </header>

        <main className="flex-1 py-8 sm:py-12">
          {status === 'idle' && (
            <EmptyState
              hint="Busque uma cidade para consultar o clima."
              title="Previsão do tempo"
            />
          )}
          {status === 'loading' && <LoadingState message="Buscando clima..." />}
          {status === 'empty' && (
            <EmptyState hint="Tente buscar outra cidade." title="Nenhuma cidade encontrada." />
          )}
          {status === 'error' && (
            <ErrorState
              message={error ?? 'Não foi possível carregar o clima. Tente novamente.'}
              onRetry={retry}
            />
          )}
          {status === 'success' && data && (
            <div className="space-y-8">
              <CurrentWeather city={data.city} current={data.current} unit={unit} />
              <ForecastList daily={data.daily} unit={unit} />
            </div>
          )}
        </main>

        <footer className="border-t border-white/10 py-6 text-sm text-slate-300">
          Dados meteorológicos por{' '}
          <a
            className="inline-flex min-h-11 items-center underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400"
            href="https://open-meteo.com/"
          >
            Open-Meteo
          </a>
          . Previsões sujeitas a variações.
        </footer>
      </div>
    </div>
  );
}
