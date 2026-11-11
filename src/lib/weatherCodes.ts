interface WeatherDescription {
  label: string;
  iconKey: string;
}

const descriptions: Record<number, WeatherDescription> = {
  0: { label: 'Céu limpo', iconKey: 'sun' },
  1: { label: 'Predominantemente limpo', iconKey: 'partly-cloudy' },
  2: { label: 'Parcialmente nublado', iconKey: 'partly-cloudy' },
  3: { label: 'Encoberto', iconKey: 'cloud' },
  45: { label: 'Nevoeiro', iconKey: 'fog' },
  48: { label: 'Nevoeiro', iconKey: 'fog' },
  51: { label: 'Garoa leve', iconKey: 'drizzle' },
  53: { label: 'Garoa moderada', iconKey: 'drizzle' },
  55: { label: 'Garoa intensa', iconKey: 'drizzle' },
  56: { label: 'Garoa congelante', iconKey: 'drizzle' },
  57: { label: 'Garoa congelante', iconKey: 'drizzle' },
  61: { label: 'Chuva leve', iconKey: 'rain' },
  63: { label: 'Chuva moderada', iconKey: 'rain' },
  65: { label: 'Chuva forte', iconKey: 'rain' },
  66: { label: 'Chuva congelante', iconKey: 'rain' },
  67: { label: 'Chuva congelante', iconKey: 'rain' },
  71: { label: 'Neve fraca', iconKey: 'snow' },
  73: { label: 'Neve moderada', iconKey: 'snow' },
  75: { label: 'Neve forte', iconKey: 'snow' },
  77: { label: 'Grãos de neve', iconKey: 'snow' },
  80: { label: 'Pancadas de chuva leves', iconKey: 'rain' },
  81: { label: 'Pancadas de chuva moderadas', iconKey: 'rain' },
  82: { label: 'Pancadas de chuva fortes', iconKey: 'rain' },
  85: { label: 'Pancadas de neve', iconKey: 'snow' },
  86: { label: 'Pancadas de neve', iconKey: 'snow' },
  95: { label: 'Tempestade', iconKey: 'storm' },
  96: { label: 'Tempestade com granizo', iconKey: 'storm' },
  99: { label: 'Tempestade com granizo', iconKey: 'storm' },
};

export function describeWeatherCode(code: number | null): WeatherDescription {
  if (code === null) {
    return { label: 'Dados indisponíveis', iconKey: 'unknown' };
  }

  return descriptions[code] ?? { label: 'Condição desconhecida', iconKey: 'unknown' };
}
