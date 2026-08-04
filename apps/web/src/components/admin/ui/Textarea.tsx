import { type TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full border border-adm-hairline bg-white px-3 py-2 text-sm text-adm-ink outline-none focus:border-adm-navy min-h-24",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
