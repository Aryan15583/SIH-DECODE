import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost" | "outline";
type Size = "sm" | "md";

const variants: Record<Variant, string> = {
  primary: "bg-primary hover:bg-primary/90 text-white border border-primary/50 glow-primary",
  secondary: "bg-surface-2 hover:bg-surface-2/70 text-text-1 border border-border-2",
  danger: "bg-danger/15 hover:bg-danger/25 text-danger border border-danger/40",
  ghost: "bg-transparent hover:bg-white/5 text-text-2 hover:text-text-1 border border-transparent",
  outline: "bg-transparent hover:bg-white/5 text-text-1 border border-border-2",
};

const sizes: Record<Size, string> = {
  sm: "text-xs px-2.5 py-1.5 gap-1.5",
  md: "text-sm px-3.5 py-2 gap-2",
};

export function Button({
  className,
  variant = "secondary",
  size = "md",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
