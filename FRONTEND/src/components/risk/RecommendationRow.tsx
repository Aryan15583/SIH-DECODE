"use client";

import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export function RecommendationRow({
  label,
  impact,
  reduction,
}: {
  label: string;
  impact: string;
  reduction: string;
}) {
  const { push } = useToast();
  return (
    <div className="flex items-center gap-3 border-b border-border-1 py-3 last:border-0">
      <ChevronRight className="h-4 w-4 shrink-0 text-text-2" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-text-1">{label}</p>
        <p className="text-xs text-text-2">{impact} impact · Risk reduction {reduction}</p>
      </div>
      <Button
        size="sm"
        variant="primary"
        onClick={() => push("Recommendation actioned", `"${label}" has been queued for remediation.`, "success")}
      >
        Action
      </Button>
    </div>
  );
}
