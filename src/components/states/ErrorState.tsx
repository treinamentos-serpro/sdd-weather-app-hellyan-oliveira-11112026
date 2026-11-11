interface ErrorStateProps {
  message: string;
  onRetry: () => void;
  isRetrying?: boolean;
}

export default function ErrorState({ message, onRetry, isRetrying = false }: ErrorStateProps) {
  return (
    <div className="space-y-3 text-red-200" role="alert">
      <p>{message}</p>
      <button
        className="min-h-11 rounded-lg border border-red-200/30 px-4 font-medium text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isRetrying}
        onClick={onRetry}
        type="button"
      >
        tentar novamente
      </button>
    </div>
  );
}
