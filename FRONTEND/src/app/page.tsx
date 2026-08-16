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

export default function RootPage() {
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
      </div>
    </SmoothScroll>
  );
}
