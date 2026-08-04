import { Button } from "@/components/admin/ui/Button";

export function ConfirmButton({
  confirmMessage,
  onConfirm,
  children,
  variant = "danger",
  size = "sm",
  disabled,
}: {
  confirmMessage: string;
  onConfirm: () => void;
  children: React.ReactNode;
  variant?: "danger" | "outline" | "ghost" | "primary";
  size?: "sm" | "md";
  disabled?: boolean;
}) {
  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      disabled={disabled}
      onClick={() => {
        if (window.confirm(confirmMessage)) onConfirm();
      }}
    >
      {children}
    </Button>
  );
}
