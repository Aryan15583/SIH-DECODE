import { ThreatDetailClient } from "@/components/threats/ThreatDetailClient";

export function generateStaticParams() {
  return [];
}

export default async function ThreatDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ThreatDetailClient threatId={id} />;
}
