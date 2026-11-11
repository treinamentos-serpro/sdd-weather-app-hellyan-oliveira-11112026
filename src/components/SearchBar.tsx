import { type FormEvent, useState } from 'react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  disabled?: boolean;
}

export default function SearchBar({ onSearch, disabled = false }: SearchBarProps) {
  const [city, setCity] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedCity = city.trim();

    if (trimmedCity) {
      onSearch(trimmedCity);
    }
  }

  return (
    <form
      aria-label="Buscar cidade"
      className="flex w-full items-stretch gap-2 rounded-xl border border-white/10 bg-white/5 p-2 shadow-glass backdrop-blur-md sm:gap-3"
      onSubmit={handleSubmit}
      role="search"
    >
      <label className="sr-only" htmlFor="city-search">
        Nome da cidade
      </label>
      <input
        autoComplete="off"
        className="min-w-0 flex-1 rounded-lg border border-white/10 bg-night-900/70 px-4 py-3 text-white placeholder:text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={disabled}
        id="city-search"
        onChange={(event) => setCity(event.target.value)}
        placeholder="Digite o nome de uma cidade"
        type="search"
        value={city}
      />
      <button
        className="min-h-11 shrink-0 rounded-lg bg-accent-500 px-4 font-medium text-night-900 transition-colors hover:bg-accent-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-60"
        disabled={disabled}
        type="submit"
      >
        Buscar
      </button>
    </form>
  );
}
