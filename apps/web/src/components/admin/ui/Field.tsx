export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="mb-3 block">
      <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-adm-muted">
        {label}
      </span>
      {children}
      {error ? <span className="mt-1 block text-xs text-adm-danger">{error}</span> : null}
    </label>
  );
}
