"use client";

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";
import { riskDomains } from "@/lib/mock-data";

export function RiskRadarChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={riskDomains} outerRadius="75%">
        <PolarGrid stroke="#243548" />
        <PolarAngleAxis dataKey="domain" tick={{ fill: "#8d9aaa", fontSize: 11 }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#8d9aaa", fontSize: 9 }} axisLine={false} />
        <Radar dataKey="score" stroke="#39d98a" fill="#39d98a" fillOpacity={0.28} strokeWidth={2} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
