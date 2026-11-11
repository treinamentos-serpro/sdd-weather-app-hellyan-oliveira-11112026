interface EmptyStateProps {
  title: string;
  hint: string;
}

export default function EmptyState({ title, hint }: EmptyStateProps) {
  return (
    <section className="space-y-2 text-slate-300">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <p>{hint}</p>
    </section>
  );
}
