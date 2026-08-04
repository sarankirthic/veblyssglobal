export function StatTile({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="border border-adm-hairline bg-white p-5">
      <div className="font-mono text-[11px] uppercase tracking-wider text-adm-muted">{label}</div>
      <div className="mt-2 text-3xl" style={{ fontFamily: "var(--adm-font-head)" }}>
        {value}
      </div>
      {hint ? <div className="mt-1 text-xs text-adm-muted">{hint}</div> : null}
    </div>
  );
}
