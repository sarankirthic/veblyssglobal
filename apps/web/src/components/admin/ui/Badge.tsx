import { cn } from "@/lib/cn";

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "danger" | "gold";
}) {
  const toneClasses = {
    neutral: "bg-adm-hairline text-adm-ink",
    success: "bg-adm-success/10 text-adm-success",
    danger: "bg-adm-danger/10 text-adm-danger",
    gold: "bg-adm-gold/15 text-adm-gold",
  }[tone];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide",
        toneClasses
      )}
    >
      {children}
    </span>
  );
}
