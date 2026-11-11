export function forecastDayLabel(date: string, index: number): string {
  const parsed = new Date(`${date}T00:00:00Z`);
  const day = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    timeZone: 'UTC',
  }).format(parsed);

  if (index === 0) {
    return `Hoje, ${day}`;
  }

  const weekday = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'short',
    timeZone: 'UTC',
  })
    .format(parsed)
    .replace(/\.$/, '');

  return `${weekday.charAt(0).toLocaleUpperCase('pt-BR')}${weekday.slice(1)}., ${day}`;
}
