import { type TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-adm-sm border border-adm-hairline bg-white px-3.5 py-2.5 text-sm text-adm-ink outline-none transition-shadow focus:border-adm-primary focus:ring-4 focus:ring-adm-primary/10 min-h-24",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
