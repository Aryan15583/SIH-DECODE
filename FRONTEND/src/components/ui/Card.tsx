import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "card-surface rounded-2xl shadow-[0_1px_0_rgba(255,255,255,0.02)_inset]",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
  className,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-4 px-5 pt-5", className)}>
      <div>
        <h3 className="text-sm font-semibold tracking-wide text-text-1">{title}</h3>
        {subtitle && <p className="mt-1 text-xs text-text-2">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
