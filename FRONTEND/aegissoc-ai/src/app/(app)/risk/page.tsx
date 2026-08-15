import { Card, CardHeader } from "@/components/ui/Card";
import { RiskRadarChart } from "@/components/risk/RiskRadarChart";
import { RiskTrendChart, IncidentHistoryChart } from "@/components/risk/RiskTrendCharts";
import { RecommendationRow } from "@/components/risk/RecommendationRow";
import { riskRecommendations, riskDomains } from "@/lib/mock-data";

export default function RiskCenterPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[380px_1fr]">
        <Card>
          <CardHeader title="Overall Risk Score" subtitle="Composite score across all domains" />
          <div className="flex flex-col items-center p-5 pt-2">
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-extrabold text-text-1">87</span>
              <span className="text-lg text-text-2">/100</span>
            </div>
            <span className="mt-1 rounded-md bg-success/12 px-2 py-0.5 text-xs font-medium text-success">Good</span>
            <RiskRadarChart />
            <div className="grid w-full grid-cols-3 gap-2 text-center">
              {riskDomains.map((d) => (
                <div key={d.domain} className="rounded-lg border border-border-1 p-2">
                  <p className="text-sm font-semibold text-text-1">{d.score}</p>
                  <p className="text-[10px] text-text-2">{d.domain}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Top Recommendations" subtitle="Highest-impact actions to reduce risk" />
          <div className="px-5 pb-3 pt-1">
            {riskRecommendations.map((r) => (
              <RecommendationRow key={r.id} label={r.label} impact={r.impact} reduction={r.reduction} />
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader title="Risk Trends" subtitle="6-month rolling risk score" />
          <div className="px-2 pb-4 pt-2"><RiskTrendChart /></div>
        </Card>
        <Card>
          <CardHeader title="Incident History" subtitle="Incidents opened per day, last 7 days" />
          <div className="px-2 pb-4 pt-2"><IncidentHistoryChart /></div>
        </Card>
      </div>
    </div>
  );
}
