"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { liveThreatActivity } from "@/lib/mock-data";

export function ThreatChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={liveThreatActivity} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="threatFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5865f2" stopOpacity={0.45} />
            <stop offset="100%" stopColor="#5865f2" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#1a2735" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="time" tick={{ fill: "#8d9aaa", fontSize: 11 }} axisLine={{ stroke: "#243548" }} tickLine={false} />
        <YAxis tick={{ fill: "#8d9aaa", fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: "#101c29", border: "1px solid #243548", borderRadius: 10, fontSize: 12 }}
          labelStyle={{ color: "#8d9aaa" }}
          itemStyle={{ color: "#f5f7fa" }}
        />
        <Area type="monotone" dataKey="events" stroke="#5865f2" strokeWidth={2.5} fill="url(#threatFill)" name="Threat Events" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
