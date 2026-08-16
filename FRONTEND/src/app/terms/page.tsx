import React from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import SmoothScroll from "@/components/landing/SmoothScroll";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <SmoothScroll>
      <div className="bg-[#050507] min-h-screen text-[#F5F5F7] overflow-x-hidden">
        <Navbar />

        {/* Top spacing to offset sticky header */}
        <div className="pt-32 pb-24 px-6 max-w-4xl mx-auto relative z-10">
          {/* Subtle Glow Accent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-[#8B5CF6]/5 blur-[120px] pointer-events-none" />

          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-[#92929F] hover:text-[#F5F5F7] transition-colors mb-10 group select-none"
          >
            <ArrowLeft className="h-3 w-3 group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </Link>

          <header className="mb-16 text-center md:text-left">
            <p className="font-sans text-[10px] md:text-xs font-semibold tracking-[0.2em] text-[#92929F] uppercase mb-4">
              Legal Conditions
            </p>
            <h1 className="font-sans text-3xl md:text-5xl font-extralight tracking-tight text-[#F5F5F7] mb-4">
              Terms of Service
            </h1>
            <p className="font-sans text-xs md:text-sm text-[#92929F] font-light">
              Last updated: August 16, 2026
            </p>
          </header>

          <main className="font-sans font-light text-sm md:text-base text-[#92929F] leading-relaxed flex flex-col gap-10">
            <section className="flex flex-col gap-4">
              <h2 className="text-lg font-normal text-[#F5F5F7]">1. Acceptance of Terms</h2>
              <p>
                By establishing an organizational account or installing the AegisSOC AI endpoint integration agents, you agree to comply with and be bound by these Terms of Service. These terms govern all access to and use of our autonomous security operations center platform.
              </p>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="text-lg font-normal text-[#F5F5F7]">2. Service Description & SLA</h2>
              <p>
                AegisSOC AI provides autonomous threat correlation, AI-agent orchestration, MITRE ATT&CK hazard mapping, and machine-assisted response routines. While we guarantee an enterprise availability service level agreement (SLA) of 99.9%, security operations remain a collaborative effort between the AI system and your human analysts.
              </p>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="text-lg font-normal text-[#F5F5F7]">3. Account Access & Perimeter Permissions</h2>
              <p>
                You are responsible for configuring scoped API keys, securing dashboard access credentials, and setting appropriate endpoint agent access policies. You grant AegisSOC AI permission to analyze, structure, and execute containment actions (such as isolating workstations or blocking malicious IPs) inside your monitored environment based on your configured rule sets.
              </p>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="text-lg font-normal text-[#F5F5F7]">4. Intellectual Property</h2>
              <p>
                The AegisSOC AI platform, including the multi-agent coordination engine, mathematical vector models, ATT&CK correlation logic, interface designs, and platform assets, represents the exclusive intellectual property of AegisSOC AI. You are granted a limited, non-exclusive license to use the system for internal enterprise security operations.
              </p>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="text-lg font-normal text-[#F5F5F7]">5. Limitation of Liability</h2>
              <p>
                AegisSOC AI continuously monitors and advises on your environment&apos;s risk profile. However, we do not guarantee absolute protection against all potential zero-day vulnerabilities, complex advanced persistent threats (APTs), or hardware breaches. AegisSOC AI shall not be held liable for security incidents or associated losses resulting from misconfigured policies or human analyst overrides.
              </p>
            </section>
          </main>
        </div>

        <Footer />
      </div>
    </SmoothScroll>
  );
}
