import { useRef, useState } from 'react';
import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';
import SearchBar from './components/SearchBar';
import EmptyState from './components/states/EmptyState';
import ErrorState from './components/states/ErrorState';
import LoadingState from './components/states/LoadingState';
import UnitToggle from './components/UnitToggle';
import { mockWeatherData } from './mocks/weather';
import type { Unit, WeatherData } from './types/weather';

type AppState =
  | { status: 'idle' }
  | { status: 'loading'; term: string }
  | { status: 'empty' }
  | { status: 'error'; term: string }
  | { status: 'success'; report: WeatherData };

interface AppProps {
  searchWeather?: (term: string) => Promise<WeatherData | null>;
}

async function searchMockWeather(term: string): Promise<WeatherData | null> {
  return term.localeCompare(mockWeatherData.city.name, 'pt-BR', { sensitivity: 'base' }) === 0
    ? mockWeatherData
    : null;
}

export default function App({ searchWeather = searchMockWeather }: AppProps) {
  const [unit, setUnit] = useState<Unit>('celsius');
  const [state, setState] = useState<AppState>({ status: 'idle' });
  const requestId = useRef(0);

  async function handleSearch(term: string) {
    const currentRequest = ++requestId.current;
    setState({ status: 'loading', term });

    try {
      const report = await searchWeather(term);
      if (currentRequest === requestId.current) {
        setState(report ? { status: 'success', report } : { status: 'empty' });
      }
    } catch {
      if (currentRequest === requestId.current) {
        setState({ status: 'error', term });
      }
    }
  }

  return (
    <div className="min-h-screen bg-night-900 font-sans text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-5 border-b border-white/10 py-6 sm:flex-row sm:items-center sm:gap-6">
          <h1 className="shrink-0 text-xl font-bold text-white">Weather App</h1>
          <SearchBar onSearch={handleSearch} />
          <UnitToggle onChange={setUnit} unit={unit} />
        </header>

        <main className="flex-1 py-8 sm:py-12">
          <p className="mb-6 text-sm text-slate-300">Dados de demonstração: Recife.</p>
          {state.status === 'idle' && (
            <EmptyState
              hint="Busque uma cidade para consultar o clima."
              title="Previsão do tempo"
            />
          )}
          {state.status === 'loading' && <LoadingState message="Buscando clima..." />}
          {state.status === 'empty' && (
            <EmptyState hint="Tente buscar outra cidade." title="Nenhuma cidade encontrada." />
          )}
          {state.status === 'error' && (
            <ErrorState
              message="Não foi possível carregar o clima. Tente novamente."
              onRetry={() => handleSearch(state.term)}
            />
          )}
          {state.status === 'success' && (
            <div className="space-y-8">
              <CurrentWeather city={state.report.city} current={state.report.current} unit={unit} />
              <ForecastList daily={state.report.daily} unit={unit} />
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
