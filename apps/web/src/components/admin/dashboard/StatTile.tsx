export function StatTile({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-adm-lg bg-white p-6 shadow-adm-sm transition-shadow hover:shadow-adm-md">
      <div className="font-mono text-[11px] uppercase tracking-wider text-adm-muted">{label}</div>
      <div className="mt-2.5 text-3xl tracking-tight" style={{ fontFamily: "var(--adm-font-head)" }}>
        {value}
      </div>
      {hint ? <div className="mt-1.5 text-xs text-adm-muted">{hint}</div> : null}
    </div>
  );
}
