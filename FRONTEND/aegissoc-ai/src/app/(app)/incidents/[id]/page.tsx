import { notFound } from "next/navigation";
import { incidents } from "@/lib/mock-data";
import { IncidentDetailClient } from "@/components/incidents/IncidentDetailClient";

export function generateStaticParams() {
  return incidents.map((i) => ({ id: i.id }));
}

export default async function IncidentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const incident = incidents.find((i) => i.id === id);
  if (!incident) notFound();
  return <IncidentDetailClient incident={incident} />;
}
