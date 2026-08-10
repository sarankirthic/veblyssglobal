import { cn } from "@/lib/cn";

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger" | "gold";
}) {
  const toneClasses = {
    neutral: "bg-adm-hairline text-adm-ink",
    success: "bg-adm-success/10 text-adm-success",
    warning: "bg-adm-warning/10 text-adm-warning",
    danger: "bg-adm-danger/10 text-adm-danger",
    gold: "bg-adm-gold/15 text-adm-gold",
  }[tone];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide",
        toneClasses
      )}
    >
      {children}
    </span>
  );
}
