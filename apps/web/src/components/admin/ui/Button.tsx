import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "outline" | "danger" | "ghost";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-adm-navy text-white border-adm-navy hover:bg-adm-navy-support disabled:opacity-50",
  outline: "bg-transparent text-adm-navy border-adm-navy hover:bg-adm-navy hover:text-white",
  danger: "bg-transparent text-adm-danger border-adm-danger hover:bg-adm-danger hover:text-white",
  ghost: "bg-transparent text-adm-ink border-transparent hover:bg-adm-hairline",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5 text-sm",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 border font-medium tracking-wide transition-colors cursor-pointer disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
