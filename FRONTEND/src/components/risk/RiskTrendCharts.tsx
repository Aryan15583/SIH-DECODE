"use client";

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const tooltipStyle = {
  contentStyle: { background: "#101c29", border: "1px solid #243548", borderRadius: 10, fontSize: 12 },
  labelStyle: { color: "#8d9aaa" },
  itemStyle: { color: "#f5f7fa" },
};

export function RiskTrendChart({
  data = [],
  loading = false,
  error = false,
}: {
  data?: { month: string; score: number }[];
  loading?: boolean;
  error?: boolean;
}) {
  if (error) {
    return (
      <div className="flex h-[200px] w-full items-center justify-center text-xs text-text-2">
        Unable to load risk trends
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-[200px] w-full items-center justify-center text-xs text-text-2 animate-pulse">
        Loading trends...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex h-[200px] w-full items-center justify-center text-xs text-text-2">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid stroke="#1a2735" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" tick={{ fill: "#8d9aaa", fontSize: 11 }} axisLine={{ stroke: "#243548" }} tickLine={false} />
        <YAxis tick={{ fill: "#8d9aaa", fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
        <Tooltip {...tooltipStyle} />
        <Line type="monotone" dataKey="score" stroke="#f5b942" strokeWidth={2.5} dot={{ r: 3, fill: "#f5b942" }} name="Risk Score" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function IncidentHistoryChart({
  data = [],
  loading = false,
  error = false,
}: {
  data?: { day: string; incidents: number }[];
  loading?: boolean;
  error?: boolean;
}) {
  if (error) {
    return (
      <div className="flex h-[200px] w-full items-center justify-center text-xs text-text-2">
        Unable to load incident history
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-[200px] w-full items-center justify-center text-xs text-text-2 animate-pulse">
        Loading history...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex h-[200px] w-full items-center justify-center text-xs text-text-2">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid stroke="#1a2735" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="day" tick={{ fill: "#8d9aaa", fontSize: 11 }} axisLine={{ stroke: "#243548" }} tickLine={false} />
        <YAxis tick={{ fill: "#8d9aaa", fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip {...tooltipStyle} />
        <Bar dataKey="incidents" fill="#5865f2" radius={[4, 4, 0, 0]} name="Incidents" />
      </BarChart>
    </ResponsiveContainer>
  );
}
