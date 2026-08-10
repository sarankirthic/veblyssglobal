export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="rounded-adm-lg border border-dashed border-adm-hairline px-8 py-16 text-center text-adm-muted">
      <div className="font-mono text-xs uppercase tracking-wider">{title}</div>
      {description ? <p className="mt-2 text-sm">{description}</p> : null}
    </div>
  );
}
