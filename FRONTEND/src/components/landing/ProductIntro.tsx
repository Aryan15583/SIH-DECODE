import { Search, Eye, ShieldCheck } from "lucide-react";

export default function ProductIntro() {
  const features = [
    {
      num: "01",
      name: "DETECT",
      icon: Search,
      desc: "Identify suspicious activity across users, devices and infrastructure.",
    },
    {
      num: "02",
      name: "INVESTIGATE",
      icon: Eye,
      desc: "Correlate events, enrich context and uncover attack paths.",
    },
    {
      num: "03",
      name: "RESPOND",
      icon: ShieldCheck,
      desc: "Move from detection to containment with autonomous security agents.",
    },
  ];

  return (
    <section id="platform" className="relative bg-[#050507] py-24 md:py-36 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#8B5CF6]/3 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#A78BFA]/2 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Editorial Header */}
        <div className="max-w-3xl mb-20 md:mb-28 reveal-up">
          <p className="font-sans text-[10px] md:text-xs font-semibold tracking-[0.2em] text-[#92929F] uppercase mb-4">
            Built for Modern Security Teams
          </p>
          <h2 className="font-sans text-3xl md:text-5xl font-extralight tracking-tight text-[#F5F5F7] leading-[1.2]">
            Your security stack generates signals. <br className="hidden md:inline" />
            Aegis turns them into <span className="text-[#A78BFA] font-light">decisions.</span>
          </h2>
        </div>

        {/* 3-Column Concept Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 reveal-stagger">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.num}
                className="reveal-item relative group flex flex-col p-8 rounded-2xl border border-white/5 bg-[#0D0D14]/30 hover:bg-[#0D0D14]/60 hover:border-white/10 transition-all duration-500 shadow-[0_1px_2px_rgba(255,255,255,0.01)_inset]"
              >
                {/* Micro-glow on Hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#A78BFA]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Top Row: Number & Icon */}
                <div className="flex items-center justify-between mb-8">
                  <span className="font-mono text-xs font-semibold text-[#A78BFA] opacity-80 tracking-widest">
                    {f.num}
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 bg-[#0D0D14] text-[#92929F] group-hover:text-[#A78BFA] group-hover:border-[#A78BFA]/20 transition-all duration-300">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                </div>

                {/* Heading & Details */}
                <h3 className="font-sans text-sm font-semibold tracking-wider text-[#F5F5F7] mb-3 uppercase">
                  {f.name}
                </h3>
                <p className="font-sans text-xs md:text-sm font-light text-[#92929F] leading-relaxed group-hover:text-[#F5F5F7]/90 transition-colors duration-300">
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

