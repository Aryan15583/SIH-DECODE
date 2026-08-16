import React from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import SmoothScroll from "@/components/landing/SmoothScroll";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the Privacy Policy for AegisSOC AI and learn how information is handled when using the platform.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <SmoothScroll>
      <div className="bg-[#050507] min-h-screen text-[#F5F5F7] overflow-x-hidden">
        <Navbar />

        {/* Top spacing to offset sticky header */}
        <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto relative z-10">
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
              Legal Operations
            </p>
            <h1 className="font-sans text-3xl md:text-5xl font-extralight tracking-tight text-[#F5F5F7] mb-4">
              Privacy Policy
            </h1>
            <p className="font-sans text-xs md:text-sm text-[#92929F] font-light">
              Last updated: August 16, 2026
            </p>
          </header>

          <main className="font-sans font-light text-sm md:text-base text-[#92929F] leading-relaxed flex flex-col gap-10">
            <section className="flex flex-col gap-4">
              <h2 className="text-lg font-normal text-[#F5F5F7]">1. Information Collection</h2>
              <p>
                AegisSOC AI operates as an autonomous security operations platform. To detect, correlate, and respond to threats, we process telemetry metadata, event log files, IP addresses, and endpoint status reports. We prioritize the confidentiality and integrity of your organizational security perimeter data.
              </p>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="text-lg font-normal text-[#F5F5F7]">2. How We Use Information</h2>
              <p>
                Collected data is processed locally and in isolated cloud environments to enable multi-agent AI threat correlation, MITRE ATT&CK prediction pipelines, and real-time incident responses. Your security metrics are never used to train public, non-isolated machine learning models.
              </p>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="text-lg font-normal text-[#F5F5F7]">3. Data Retention & Isolation</h2>
              <p>
                We employ advanced endpoint data encryption and scoped database schemas to guarantee absolute data isolation. Threat indicators and log metrics are retained in accordance with your organization&apos;s selected policy rules and are securely purged upon request or contract termination.
              </p>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="text-lg font-normal text-[#F5F5F7]">4. Security Controls</h2>
              <p>
                AegisSOC AI enforces rigorous security controls. Access to your security console dashboard is protected by multi-factor authentication, scoped access tokens, and enterprise directory integration protocols. Telemetry transmissions are encrypted using Transport Layer Security (TLS 1.3).
              </p>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="text-lg font-normal text-[#F5F5F7]">5. Your Rights and Preferences</h2>
              <p>
                Your security operations administrators retain granular control over the data shared with the platform. You may adjust metadata export levels, configure custom agent collection parameters, and request complete log deletions directly from your Settings panel inside the dashboard.
              </p>
            </section>
          </main>
        </div>

        <Footer />
      </div>
    </SmoothScroll>
  );
}
