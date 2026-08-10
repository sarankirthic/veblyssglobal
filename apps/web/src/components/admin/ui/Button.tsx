import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "outline" | "danger" | "ghost";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-adm-primary text-white border-adm-primary shadow-adm-sm hover:bg-adm-primary-support hover:shadow-adm-md disabled:opacity-50 disabled:shadow-none",
  outline: "bg-white text-adm-primary border-adm-hairline hover:border-adm-primary hover:bg-adm-neutral-light",
  danger: "bg-transparent text-adm-danger border-adm-danger/30 hover:bg-adm-danger hover:border-adm-danger hover:text-white",
  ghost: "bg-transparent text-adm-ink border-transparent hover:bg-adm-hairline/60",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3.5 py-1.5 text-xs rounded-adm-sm",
  md: "px-4.5 py-2.5 text-sm rounded-adm-sm",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 border font-medium tracking-wide transition-all cursor-pointer disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
