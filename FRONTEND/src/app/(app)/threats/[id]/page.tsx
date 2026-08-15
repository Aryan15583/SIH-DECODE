import { notFound } from "next/navigation";
import { threats } from "@/lib/mock-data";
import { ThreatDetailClient } from "@/components/threats/ThreatDetailClient";

export function generateStaticParams() {
  return threats.map((t) => ({ id: t.id }));
}

export default async function ThreatDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const threat = threats.find((t) => t.id === id);
  if (!threat) notFound();
  return <ThreatDetailClient threat={threat} />;
}
