import { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-adm-sm border border-adm-hairline bg-white px-3.5 py-2.5 text-sm text-adm-ink outline-none transition-shadow focus:border-adm-primary focus:ring-4 focus:ring-adm-primary/10",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
