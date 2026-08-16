import { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import ProductIntro from "@/components/landing/ProductIntro";
import DashboardShowcase from "@/components/landing/DashboardShowcase";
import AIAgents from "@/components/landing/AIAgents";
import ThreatPrediction from "@/components/landing/ThreatPrediction";
import AttackGraph from "@/components/landing/AttackGraph";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";
import SmoothScroll from "@/components/landing/SmoothScroll";

export const metadata: Metadata = {
  title: "AegisSOC AI — Autonomous Cybersecurity Platform",
  description:
    "AegisSOC AI is an autonomous cybersecurity platform that detects threats, investigates incidents, predicts risks, and helps security teams respond faster.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    title: "AegisSOC AI — Autonomous Cybersecurity Platform",
    description:
      "AegisSOC AI is an autonomous cybersecurity platform that detects threats, investigates incidents, predicts risks, and helps security teams respond faster.",
    url: "https://aegissocai.vercel.app/",
    siteName: "AegisSOC AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "AegisSOC AI — Autonomous Cybersecurity Platform",
    description:
      "AegisSOC AI is an autonomous cybersecurity platform that detects threats, investigates incidents, predicts risks, and helps security teams respond faster.",
  },
};

export default function RootPage() {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "AegisSOC AI",
    "alternateName": ["AegisSOC", "Aegis SOC AI"],
    "url": "https://aegissocai.vercel.app/",
  };

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AegisSOC AI",
    "url": "https://aegissocai.vercel.app/",
  };

  return (
    <SmoothScroll>
      <div className="bg-[#050507] min-h-screen text-[#F5F5F7] overflow-x-hidden">
        <Navbar />
        <Hero />
        <ProductIntro />
        <DashboardShowcase />
        <AIAgents />
        <ThreatPrediction />
        <AttackGraph />
        <FinalCTA />
        <Footer />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </div>
    </SmoothScroll>
  );
}
