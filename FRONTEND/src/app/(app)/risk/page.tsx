"use client";

import { Card, CardHeader } from "@/components/ui/Card";
import { RiskRadarChart } from "@/components/risk/RiskRadarChart";
import { RiskTrendChart, IncidentHistoryChart } from "@/components/risk/RiskTrendCharts";
import { RecommendationRow } from "@/components/risk/RecommendationRow";
import { useApi } from "@/hooks/useApi";
import { getRisk } from "@/lib/api/risk";

export default function RiskCenterPage() {
  const { data, loading, error } = useApi(getRisk);

  const domains = data?.domains || [];
  const recommendations = data?.recommendations || [];
  const trend = data?.trend || [];
  const history = data?.history || [];

  const hasRiskData = domains.length > 0 && !error && !loading;
  const overallScore = hasRiskData ? "87" : "—";
  const riskLevel = hasRiskData ? "Good" : "Not available";
  const levelClass = hasRiskData ? "bg-success/12 text-success" : "bg-white/5 text-text-2";

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[380px_1fr]">
        <Card>
          <CardHeader title="Overall Risk Score" subtitle="Composite score across all domains" />
          <div className="flex flex-col items-center p-5 pt-2">
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-extrabold text-text-1">{overallScore}</span>
              <span className="text-lg text-text-2">/100</span>
            </div>
            <span className={`mt-1 rounded-md px-2 py-0.5 text-xs font-medium ${levelClass}`}>{riskLevel}</span>
            
            <RiskRadarChart data={domains} loading={loading} error={!!error} />
            
            <div className="grid w-full grid-cols-3 gap-2 text-center mt-4">
              {error ? (
                <p className="col-span-full text-center text-xs text-text-2 py-4">Unable to load domains</p>
              ) : loading ? (
                <p className="col-span-full text-center text-xs text-text-2 py-4 animate-pulse">Loading domains...</p>
              ) : domains.length > 0 ? (
                domains.map((d) => (
                  <div key={d.domain} className="rounded-lg border border-border-1 p-2">
                    <p className="text-sm font-semibold text-text-1">{d.score}</p>
                    <p className="text-[10px] text-text-2">{d.domain}</p>
                  </div>
                ))
              ) : (
                <p className="col-span-full text-center text-xs text-text-2 py-4">No risk domains mapped</p>
              )}
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Top Recommendations" subtitle="Highest-impact actions to reduce risk" />
          <div className="px-5 pb-3 pt-1">
            {error ? (
              <p className="text-center text-xs text-text-2 py-8">Unable to load recommendations</p>
            ) : loading ? (
              <p className="text-center text-xs text-text-2 py-8 animate-pulse">Loading recommendations...</p>
            ) : recommendations.length > 0 ? (
              recommendations.map((r) => (
                <RecommendationRow key={r.id} label={r.label} impact={r.impact} reduction={r.reduction} />
              ))
            ) : (
              <p className="text-center text-xs text-text-2 py-8">No recommendations available</p>
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader title="Risk Trends" subtitle="6-month rolling risk score" />
          <div className="px-2 pb-4 pt-2">
            <RiskTrendChart data={trend} loading={loading} error={!!error} />
          </div>
        </Card>
        <Card>
          <CardHeader title="Incident History" subtitle="Incidents opened per day, last 7 days" />
          <div className="px-2 pb-4 pt-2">
            <IncidentHistoryChart data={history} loading={loading} error={!!error} />
          </div>
        </Card>
      </div>
    </div>
  );
}
