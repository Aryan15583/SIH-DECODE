import { cn } from "@/lib/utils";
import type { Prediction } from "@/types";

const tone = (prob: number) => {
  if (prob >= 75) return { text: "text-danger", bar: "bg-danger" };
  if (prob >= 50) return { text: "text-warning", bar: "bg-warning" };
  return { text: "text-success", bar: "bg-success" };
};

export function PredictionList({
  predictions,
  loading = false,
  error = false,
}: {
  predictions: Prediction[];
  loading?: boolean;
  error?: boolean;
}) {
  if (error) {
    return <p className="text-center text-xs text-text-2 py-4">Unable to load predictions</p>;
  }

  if (loading) {
    return <p className="text-center text-xs text-text-2 py-4 animate-pulse">Loading predictions...</p>;
  }

  if (predictions.length === 0) {
    return <p className="text-center text-xs text-text-2 py-4">No predictions available</p>;
  }

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
