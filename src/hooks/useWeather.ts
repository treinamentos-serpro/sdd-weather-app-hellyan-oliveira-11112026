import { useEffect, useRef, useState } from 'react';
import { getWeather, searchCities, WeatherServiceError } from '../services/weatherService';
import type { City } from '../types/city';
import type { WeatherData } from '../types/weather';

interface WeatherHookState {
  status: 'idle' | 'loading' | 'success' | 'error' | 'empty';
  data: WeatherData | null;
  cities: City[];
  error: string | null;
  query: string;
}

type Operation = { type: 'search'; name: string } | { type: 'select'; city: City };

export function useWeather() {
  const [state, setState] = useState<WeatherHookState>({
    status: 'idle',
    data: null,
    cities: [],
    error: null,
    query: '',
  });
  const lastOperation = useRef<Operation | null>(null);
  const requestId = useRef(0);
  const pending = useRef(false);

  useEffect(() => {
    return () => {
      requestId.current += 1;
    };
  }, []);

  async function execute(operation: Operation): Promise<void> {
    const currentRequest = ++requestId.current;
    lastOperation.current = operation;
    pending.current = true;
    setState((previous) => ({
      ...previous,
      status: 'loading',
      data: null,
      error: null,
      cities: operation.type === 'search' ? [] : previous.cities,
      query: operation.type === 'search' ? operation.name : previous.query,
    }));
    let fallbackMessage = 'Não foi possível carregar o clima. Tente novamente.';

    try {
      let city: City;
      if (operation.type === 'search') {
        fallbackMessage = 'Não foi possível buscar cidades. Tente novamente.';
        const cities = await searchCities(operation.name);
        if (currentRequest !== requestId.current) return;
        setState((previous) => ({ ...previous, cities }));

        if (!cities.length) {
          setState((previous) => ({ ...previous, status: 'empty' }));
          return;
        }
        city = cities[0];
      } else {
        city = operation.city;
      }

      fallbackMessage = 'Não foi possível carregar o clima. Tente novamente.';
      const data = await getWeather(city);
      if (currentRequest !== requestId.current) return;
      setState((previous) => ({ ...previous, status: 'success', data }));
    } catch (error) {
      if (currentRequest !== requestId.current) return;
      setState((previous) => ({
        ...previous,
        status: 'error',
        error: error instanceof WeatherServiceError ? error.message : fallbackMessage,
      }));
    } finally {
      if (currentRequest === requestId.current) pending.current = false;
    }
  }

  async function search(name: string): Promise<void> {
    await execute({ type: 'search', name });
  }

  async function selectCity(city: City): Promise<void> {
    await execute({ type: 'select', city });
  }

  async function retry(): Promise<void> {
    if (pending.current || !lastOperation.current) return;
    await execute(lastOperation.current);
  }

  return { ...state, search, selectCity, retry };
}
