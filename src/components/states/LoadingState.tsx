interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = 'Carregando...' }: LoadingStateProps) {
  return (
    <p className="text-slate-300" role="status">
      {message}
    </p>
  );
}
