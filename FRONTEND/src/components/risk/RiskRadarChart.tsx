"use client";

import { PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from "recharts";

export function RiskRadarChart({
  data = [],
  loading = false,
  error = false,
}: {
  data?: { domain: string; score: number }[];
  loading?: boolean;
  error?: boolean;
}) {
  if (error) {
    return (
      <div className="flex h-[280px] w-full items-center justify-center text-xs text-text-2">
        Unable to load data
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-[280px] w-full items-center justify-center text-xs text-text-2 animate-pulse">
        Loading data...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex h-[280px] w-full items-center justify-center text-xs text-text-2">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data} outerRadius="75%">
        <PolarGrid stroke="#243548" />
        <PolarAngleAxis dataKey="domain" tick={{ fill: "#8d9aaa", fontSize: 11 }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#8d9aaa", fontSize: 9 }} axisLine={false} />
        <Radar dataKey="score" stroke="#39d98a" fill="#39d98a" fillOpacity={0.28} strokeWidth={2} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
