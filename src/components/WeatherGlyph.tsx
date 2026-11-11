interface WeatherGlyphProps {
  iconKey: string;
  className?: string;
}

export default function WeatherGlyph({
  iconKey,
  className = 'h-24 w-24 sm:h-28 sm:w-28',
}: WeatherGlyphProps) {
  return (
    <svg
      aria-hidden="true"
      className={`${className} text-sun`}
      fill="none"
      viewBox="0 0 96 96"
    >
      {(iconKey === 'sun' || iconKey === 'partly-cloudy') && (
        <>
          <circle cx="48" cy="38" r="17" fill="currentColor" opacity="0.9" />
          <path
            d="M48 9v8m0 42v8M19 38h8m42 0h8M27.5 17.5l5.7 5.7m29.6 29.6 5.7 5.7m0-41-5.7 5.7m-29.6 29.6-5.7 5.7"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="3"
          />
        </>
      )}
      {iconKey !== 'sun' && iconKey !== 'unknown' && (
        <path
          d="M26 65h43a13 13 0 0 0 1-26 22 22 0 0 0-42-5 16 16 0 0 0-2 31Z"
          fill="#182238"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="4"
        />
      )}
      {(iconKey === 'drizzle' || iconKey === 'rain') && (
        <path
          d="m37 73-4 8m18-8-4 8m18-8-4 8"
          stroke="#8b9bff"
          strokeLinecap="round"
          strokeWidth="4"
        />
      )}
      {iconKey === 'snow' && (
        <path
          d="M37 73v12m-5-9 10 6m0-6-10 6m23-9v12m-5-9 10 6m0-6-10 6"
          stroke="#d7eaff"
          strokeLinecap="round"
          strokeWidth="2.5"
        />
      )}
      {iconKey === 'storm' && <path d="m51 68-11 15h9l-3 11 14-18h-9l4-8Z" fill="#f5b942" />}
      {iconKey === 'fog' && (
        <path d="M21 73h54M27 83h42" stroke="currentColor" strokeLinecap="round" strokeWidth="3" />
      )}
      {iconKey === 'unknown' && (
        <circle cx="48" cy="48" r="31" stroke="currentColor" strokeWidth="4" />
      )}
    </svg>
  );
}
