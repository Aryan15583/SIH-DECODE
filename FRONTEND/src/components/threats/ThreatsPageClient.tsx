"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { SeverityBadge, StatusBadge } from "@/components/ui/Badge";
import type { Severity, ThreatStatus } from "@/types";
import { useApi } from "@/hooks/useApi";
import { getThreats } from "@/lib/api/threats";

const SEVERITIES: (Severity | "All")[] = ["All", "Critical", "High", "Medium", "Low"];
const STATUSES: (ThreatStatus | "All")[] = ["All", "Active", "Investigating", "Monitoring", "Contained", "Resolved"];

function FilterSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
}) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className="rounded-lg border border-border-1 bg-surface-1 px-3 py-2 text-xs text-text-1 outline-none focus:border-primary/50 cursor-pointer"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {label}: {o}
        </option>
      ))}
    </select>
  );
}

export function ThreatsPageClient() {
  const { data, loading, error } = useApi(getThreats);
  const threats = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const [query, setQuery] = useState("");
  const [severity, setSeverity] = useState<Severity | "All">("All");
  const [status, setStatus] = useState<ThreatStatus | "All">("All");
  const [source, setSource] = useState<string>("All");

  const sources = useMemo(() => ["All", ...Array.from(new Set(threats.map((t) => t.source)))], [threats]);

  const filtered = useMemo(() => {
    return threats.filter((t) => {
      if (severity !== "All" && t.severity !== severity) return false;
      if (status !== "All" && t.status !== status) return false;
      if (source !== "All" && t.source !== source) return false;
      if (query && !`${t.name} ${t.asset} ${t.user}`.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [threats, query, severity, status, source]);

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-wrap items-center gap-2.5 p-3.5">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search threats, assets or users..."
            className="w-full rounded-lg border border-border-1 bg-surface-1 py-2 pl-9 pr-3 text-sm text-text-1 placeholder:text-text-2 outline-none focus:border-primary/50"
          />
        </div>
        <FilterSelect label="Severity" value={severity} options={SEVERITIES} onChange={setSeverity} />
        <FilterSelect label="Status" value={status} options={STATUSES} onChange={setStatus} />
        <FilterSelect label="Source" value={source as string} options={sources} onChange={setSource} />
        <button className="flex items-center gap-1.5 rounded-lg border border-border-2 px-3 py-2 text-xs text-text-2 hover:text-text-1 cursor-pointer">
          <SlidersHorizontal className="h-3.5 w-3.5" /> Full filter
        </button>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="border-b border-border-1 text-xs text-text-2">
                <th className="px-5 py-3 font-medium">Threat</th>
                <th className="px-5 py-3 font-medium">Severity</th>
                <th className="px-5 py-3 font-medium">Asset</th>
                <th className="px-5 py-3 font-medium">User</th>
                <th className="px-5 py-3 font-medium">AI Confidence</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">First Seen</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {error ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-sm text-text-2">
                    Unable to load active threats
                  </td>
                </tr>
              ) : loading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-sm text-text-2 animate-pulse">
                    Loading active threats...
                  </td>
                </tr>
              ) : (
                <>
                  {filtered.map((t) => (
                    <tr key={t.id} className="border-b border-border-1 last:border-0 hover:bg-white/[0.03]">
                      <td className="px-5 py-3">
                        <Link href={`/threats/${t.id}`} className="font-medium text-text-1 hover:text-primary">
                          {t.name}
                        </Link>
                        <p className="text-xs text-text-2">{t.type}</p>
                      </td>
                      <td className="px-5 py-3"><SeverityBadge severity={t.severity} /></td>
                      <td className="px-5 py-3 text-text-2">{t.asset}</td>
                      <td className="px-5 py-3 text-text-2">{t.user}</td>
                      <td className="px-5 py-3 text-text-1">{t.aiConfidence}%</td>
                      <td className="px-5 py-3"><StatusBadge status={t.status} /></td>
                      <td className="px-5 py-3 text-text-2 tabular-nums">{t.firstSeen}</td>
                      <td className="px-5 py-3">
                        <Link href={`/threats/${t.id}`}>
                          <ChevronRight className="h-4 w-4 text-text-2 hover:text-text-1" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-5 py-10 text-center text-sm text-text-2">
                        {threats.length === 0 ? "No active threats" : "No threats match your filters."}
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-border-1 px-5 py-3 text-xs text-text-2">
          <span>Showing {filtered.length} of {threats.length} threats</span>
          <div className="flex items-center gap-2">
            <button className="rounded-md border border-border-2 px-2.5 py-1 hover:text-text-1 cursor-pointer">Prev</button>
            <span className="rounded-md bg-primary/15 px-2.5 py-1 text-primary border border-primary/30">1</span>
            <button className="rounded-md border border-border-2 px-2.5 py-1 hover:text-text-1 cursor-pointer">Next</button>
          </div>
        </div>
      </Card>
    </div>
  );
}
