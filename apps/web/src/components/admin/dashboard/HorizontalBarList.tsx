export function HorizontalBarList({
  rows,
}: {
  rows: { label: string; value: number }[];
}) {
  if (rows.length === 0) {
    return <p className="text-sm text-adm-muted">No data in this range yet.</p>;
  }

  const max = Math.max(1, ...rows.map((r) => r.value));

  return (
    <div className="flex flex-col gap-2">
      {rows.map((r) => (
        <div key={r.label} className="flex items-center gap-3">
          <div className="w-24 shrink-0 truncate font-mono text-xs text-adm-muted">{r.label}</div>
          <div className="h-2.5 flex-1 rounded-full bg-adm-neutral-light">
            <div
              className="h-2.5 rounded-full bg-adm-primary"
              style={{ width: `${Math.max(4, (r.value / max) * 100)}%` }}
              title={`${r.label}: ${r.value}`}
            />
          </div>
          <div className="w-10 shrink-0 text-right text-xs text-adm-muted">{r.value}</div>
        </div>
      ))}
    </div>
  );
}
