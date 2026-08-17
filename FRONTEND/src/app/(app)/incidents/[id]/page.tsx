import { IncidentDetailClient } from "@/components/incidents/IncidentDetailClient";

export function generateStaticParams() {
  return [];
}

export default async function IncidentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <IncidentDetailClient incidentId={id} />;
}
