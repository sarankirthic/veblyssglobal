import { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full border border-adm-hairline bg-white px-3 py-2 text-sm text-adm-ink outline-none focus:border-adm-navy",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
