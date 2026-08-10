import { cn } from "@/lib/cn";

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-adm-lg bg-white shadow-adm-sm">
      <table>{children}</table>
    </div>
  );
}

export function Thead({ children }: { children: React.ReactNode }) {
  return <thead className="border-b border-adm-hairline bg-adm-neutral-light/60">{children}</thead>;
}

export function Th({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <th
      className={cn(
        "px-5 py-3.5 text-left font-mono text-[11px] uppercase tracking-wider text-adm-muted",
        className
      )}
    >
      {children}
    </th>
  );
}

export function Tr({ children }: { children: React.ReactNode }) {
  return (
    <tr className="border-b border-adm-hairline/70 last:border-b-0 transition-colors hover:bg-adm-neutral-light/50">
      {children}
    </tr>
  );
}

export function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={cn("px-5 py-3.5 text-sm align-top", className)}>{children}</td>;
}
