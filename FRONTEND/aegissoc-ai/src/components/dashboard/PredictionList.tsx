import { cn } from "@/lib/utils";
import type { Prediction } from "@/types";

function tone(p: number) {
  if (p >= 70) return { bar: "bg-danger", text: "text-danger" };
  if (p >= 45) return { bar: "bg-warning", text: "text-warning" };
  return { bar: "bg-success", text: "text-success" };
}

export function PredictionList({ predictions }: { predictions: Prediction[] }) {
  return (
    <div className="flex flex-col gap-4">
      {predictions.map((p) => {
        const t = tone(p.probability);
        return (
          <div key={p.label}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="text-text-1">{p.label}</span>
              <span className={cn("font-semibold", t.text)}>{p.probability}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
              <div className={cn("h-full rounded-full", t.bar)} style={{ width: `${p.probability}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
