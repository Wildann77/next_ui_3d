"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAppStore } from "@/store/useAppStore";
import GridCrosshair from "@/components/dom/GridCrosshair";
import { View, PerspectiveCamera } from "@react-three/drei";
import FormatModelViewer from "@/components/canvas/FormatModelViewer";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function FormatsStickySection() {
  const isLoaded = useAppStore((s) => s.isLoaded);
  const setActiveTheme = useAppStore((s) => s.setActiveTheme);

  const [activeFormat, setActiveFormat] = useState<1 | 2>(1);

  // ROI Calculator States
  const [investment, setInvestment] = useState<number>(250000); // $250,000
  const [dailyTraffic, setDailyTraffic] = useState<number>(450); // 450 guests/day
  const [avgTicket, setAvgTicket] = useState<number>(38); // $38 average ticket

  // Computed ROI Metrics
  const monthlyGrossRevenue = Math.round(dailyTraffic * avgTicket * 30.5);
  const netMargin = activeFormat === 1 ? 0.342 : 0.385; // 34.2% vs 38.5%
  const monthlyNetProfit = Math.round(monthlyGrossRevenue * netMargin);
  const breakEvenMonths =
    monthlyNetProfit > 0
      ? (investment / monthlyNetProfit).toFixed(1)
      : "0.0";
  const threeYearRoi =
    investment > 0
      ? Math.round(((monthlyNetProfit * 36 - investment) / investment) * 100)
      : 0;

  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const format1CardRef = useRef<HTMLDivElement>(null);
  const format2CardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoaded || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Background Theme Transition: Sage/Dark <-> Editorial Bone
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 60%",
        end: "bottom 40%",
        onEnter: () => {
          setActiveTheme("light");
          gsap.to(document.body, {
            backgroundColor: "oklch(94.1% 0.019 82)",
            duration: 0.8,
            ease: "power2.out",
          });
        },
        onLeaveBack: () => {
          setActiveTheme("sage");
          gsap.to(document.body, {
            backgroundColor: "oklch(29.2% 0.018 135)",
            duration: 0.8,
            ease: "power2.out",
          });
        },
      });

      // 2. Pinning Left Column on Desktop
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        if (!containerRef.current || !leftColRef.current) return;

        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top 90px",
          end: "bottom bottom",
          pin: leftColRef.current,
          pinSpacing: false,
        });

        // Toggle activeFormat based on scrolling through the two format cards
        if (format2CardRef.current) {
          ScrollTrigger.create({
            trigger: format2CardRef.current,
            start: "top 55%",
            onEnter: () => setActiveFormat(2),
            onLeaveBack: () => setActiveFormat(1),
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isLoaded, setActiveTheme]);

  return (
    <section
      ref={sectionRef}
      id="specs"
      className="w-full relative py-24 border-t border-[var(--color-hairline-light)] text-[var(--color-obsidian)] transition-colors duration-700"
    >
      <GridCrosshair position="top-left" />
      <GridCrosshair position="top-right" />

      {/* Section Header */}
      <div className="mb-14">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-[var(--color-terracotta-volt)]" />
          <span className="font-mono text-xs tracking-widest uppercase text-[var(--color-obsidian)]/60">
            04 // SPATIAL ARCHITECTURE & FORMAT COMPARISON
          </span>
        </div>
        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight mt-3 text-[var(--color-obsidian)]">
          TWO DEPLOYMENT TIERS. <br />
          <span className="text-[var(--color-obsidian)]/40">
            ONE UNIFIED OPERATING SYSTEM.
          </span>
        </h2>
        <p className="font-sans text-base text-[var(--color-obsidian)]/70 max-w-2xl mt-4">
          From rapid urban micro-footprints to experiential two-tier spatial
          lounges. Every square meter is engineered for maximum throughput,
          tactile brutalist presence, and rapid payback velocity.
        </p>
      </div>

      {/* Split-Screen Grid Layout */}
      <div
        ref={containerRef}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative min-h-0 lg:min-h-[1400px]"
      >
        {/* Left Column: Pinned 3D Spatial Model Viewer (5 Columns) */}
        <div
          ref={leftColRef}
          className="lg:col-span-5 h-[380px] sm:h-[460px] lg:h-[calc(100vh-140px)] w-full flex flex-col justify-between border border-[var(--color-hairline-light)] bg-black/[0.03] p-4 sm:p-6 relative backdrop-blur-sm"
        >
          <GridCrosshair position="top-left" />
          <GridCrosshair position="top-right" />
          <GridCrosshair position="bottom-left" />
          <GridCrosshair position="bottom-right" />

          {/* Viewer Top Status Bar & Tab Switcher */}
          <div className="flex flex-col gap-3 z-20">
            <div className="flex items-center justify-between font-mono text-xs text-[var(--color-obsidian)]/60 border-b border-[var(--color-hairline-light)] pb-3">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[var(--color-terracotta-volt)] animate-pulse" />
                <span>SPATIAL DIGITAL TWIN // LIVE</span>
              </span>
              <span>RENDER ENGINE: R3F 9.8</span>
            </div>

            {/* Manual Toggle Buttons */}
            <div className="grid grid-cols-2 gap-2 mt-1" role="tablist" aria-label="Format model tier selection">
              <button
                role="tab"
                aria-selected={activeFormat === 1}
                aria-label="Select Format 01 Compact Core (45-65 m²)"
                onClick={() => setActiveFormat(1)}
                className={`py-2 px-3 font-mono text-xs uppercase tracking-wider transition-all cursor-pointer border ${
                  activeFormat === 1
                    ? "bg-[var(--color-obsidian)] text-[var(--color-editorial-bone)] border-[var(--color-obsidian)] font-bold shadow-md"
                    : "bg-transparent text-[var(--color-obsidian)]/70 border-[var(--color-hairline-light)] hover:border-[var(--color-obsidian)]"
                }`}
              >
                01 // COMPACT CORE
              </button>
              <button
                role="tab"
                aria-selected={activeFormat === 2}
                aria-label="Select Format 02 Flagship Lounge (180-320 m²)"
                onClick={() => setActiveFormat(2)}
                className={`py-2 px-3 font-mono text-xs uppercase tracking-wider transition-all cursor-pointer border ${
                  activeFormat === 2
                    ? "bg-[var(--color-obsidian)] text-[var(--color-editorial-bone)] border-[var(--color-obsidian)] font-bold shadow-md"
                    : "bg-transparent text-[var(--color-obsidian)]/70 border-[var(--color-hairline-light)] hover:border-[var(--color-obsidian)]"
                }`}
              >
                02 // FLAGSHIP LOUNGE
              </button>
            </div>
          </div>

          {/* WebGL 3D Canvas Tunnel Mount Target */}
          <div className="w-full flex-1 relative my-2 overflow-hidden flex items-center justify-center [touch-action:pan-y]">
            <View className="w-full h-full relative cursor-grab active:cursor-grabbing select-none [touch-action:pan-y]">
              <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />
              <FormatModelViewer activeFormat={activeFormat} />
            </View>

            {/* Floating Spatial HUD Badge */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none select-none font-mono text-[10px] tracking-widest uppercase bg-[#0e0e0e]/90 text-[#ff5500] px-3 py-1 border border-[#ff5500]/60 whitespace-nowrap shadow-xl backdrop-blur-md transition-all duration-300">
              {activeFormat === 1
                ? "[ MOD // 01: COMPACT CORE · 55 M² ]"
                : "[ MOD // 02: FLAGSHIP LOUNGE · 250 M² ]"}
            </div>
          </div>

          {/* Viewer Bottom Telemetry Footer */}
          <div className="pt-3 border-t border-[var(--color-hairline-light)] flex items-center justify-between font-mono text-xs text-[var(--color-obsidian)]/60 z-20">
            <span>
              STATUS: {activeFormat === 1 ? "SINGLE CORE MODULE" : "EXPANDED PAVILION"}
            </span>
            <span className="text-[var(--color-terracotta-volt)] font-bold">
              {activeFormat === 1 ? "45–65 M²" : "180–320 M²"}
            </span>
          </div>
        </div>

        {/* Right Column: Scrollable Format Cards & ROI Calculator (7 Columns) */}
        <div className="lg:col-span-7 flex flex-col gap-10">
          {/* Format Card 01 */}
          <div
            ref={format1CardRef}
            className={`p-6 sm:p-8 border transition-all duration-500 relative ${
              activeFormat === 1
                ? "border-[var(--color-obsidian)] bg-white/40 shadow-xl"
                : "border-[var(--color-hairline-light)] bg-transparent opacity-80"
            }`}
          >
            <GridCrosshair position="top-left" />
            <GridCrosshair position="top-right" />

            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold px-2 py-0.5 bg-[var(--color-obsidian)] text-[var(--color-editorial-bone)] uppercase tracking-wider">
                TIER 01 // HIGH-DENSITY URBAN
              </span>
              <span className="font-mono text-xs text-[var(--color-obsidian)]/60">
                TIMELINE: 45 DAYS TURNKEY
              </span>
            </div>

            <h3 className="font-display text-3xl font-black mt-4 uppercase tracking-tight text-[var(--color-obsidian)]">
              01 // COMPACT CORE
            </h3>
            <p className="font-sans text-sm text-[var(--color-obsidian)]/80 mt-2 leading-relaxed">
              Engineered for transit hubs, corporate lobbies, and high-footfall
              retail corners. Autonomous double-group volumetric extraction,
              streamlined barista ergonomics, and single-operator throughput.
            </p>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-[var(--color-hairline-light)]">
              <div>
                <span className="font-mono text-[10px] uppercase text-[var(--color-obsidian)]/50 block">
                  FOOTPRINT
                </span>
                <span className="font-display text-lg font-bold text-[var(--color-obsidian)]">
                  45–65 m²
                </span>
              </div>
              <div>
                <span className="font-mono text-[10px] uppercase text-[var(--color-obsidian)]/50 block">
                  CAPEX BRACKET
                </span>
                <span className="font-display text-lg font-bold text-[var(--color-obsidian)]">
                  $145,000
                </span>
              </div>
              <div>
                <span className="font-mono text-[10px] uppercase text-[var(--color-obsidian)]/50 block">
                  TARGET MARGIN
                </span>
                <span className="font-display text-lg font-bold text-[var(--color-terracotta-volt)]">
                  34.2% NET
                </span>
              </div>
              <div>
                <span className="font-mono text-[10px] uppercase text-[var(--color-obsidian)]/50 block">
                  BREAK-EVEN
                </span>
                <span className="font-display text-lg font-bold text-[var(--color-obsidian)]">
                  4.5 MONTHS
                </span>
              </div>
            </div>

            {/* Included Deliverables */}
            <ul className="mt-6 space-y-2 font-mono text-xs text-[var(--color-obsidian)]/80">
              <li className="flex items-center gap-2">
                <span className="text-[var(--color-terracotta-volt)] font-bold">✓</span>
                Custom Monolithic Stainless Extraction Island with Under-Counter Engines
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[var(--color-terracotta-volt)] font-bold">✓</span>
                Autonomous POS Terminal + Contactless Customer Hand-off Station
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[var(--color-terracotta-volt)] font-bold">✓</span>
                Integrated 4K Telemetry HUD & Sensory Foot-Traffic Counting Node
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[var(--color-terracotta-volt)] font-bold">✓</span>
                Turnkey 21-Day Staff Academy & Operational Standard Protocol
              </li>
            </ul>
          </div>

          {/* Format Card 02 */}
          <div
            ref={format2CardRef}
            className={`p-6 sm:p-8 border transition-all duration-500 relative ${
              activeFormat === 2
                ? "border-[var(--color-obsidian)] bg-white/40 shadow-xl"
                : "border-[var(--color-hairline-light)] bg-transparent opacity-80"
            }`}
          >
            <GridCrosshair position="top-left" />
            <GridCrosshair position="top-right" />

            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold px-2 py-0.5 bg-[var(--color-terracotta-volt)] text-[var(--color-obsidian)] uppercase tracking-wider">
                TIER 02 // SPATIAL ENTERPRISE
              </span>
              <span className="font-mono text-xs text-[var(--color-obsidian)]/60">
                TIMELINE: 90 DAYS TURNKEY
              </span>
            </div>

            <h3 className="font-display text-3xl font-black mt-4 uppercase tracking-tight text-[var(--color-obsidian)]">
              02 // FLAGSHIP LOUNGE
            </h3>
            <p className="font-sans text-sm text-[var(--color-obsidian)]/80 mt-2 leading-relaxed">
              The ultimate brand sanctuary. Double-height architectural volumes,
              dedicated VIP tasting bar, integrated roastery showcase, and
              curated spatial audio zoning for high-dwell luxury clientele.
            </p>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-[var(--color-hairline-light)]">
              <div>
                <span className="font-mono text-[10px] uppercase text-[var(--color-obsidian)]/50 block">
                  FOOTPRINT
                </span>
                <span className="font-display text-lg font-bold text-[var(--color-obsidian)]">
                  180–320 m²
                </span>
              </div>
              <div>
                <span className="font-mono text-[10px] uppercase text-[var(--color-obsidian)]/50 block">
                  CAPEX BRACKET
                </span>
                <span className="font-display text-lg font-bold text-[var(--color-obsidian)]">
                  $380,000
                </span>
              </div>
              <div>
                <span className="font-mono text-[10px] uppercase text-[var(--color-obsidian)]/50 block">
                  TARGET MARGIN
                </span>
                <span className="font-display text-lg font-bold text-[var(--color-terracotta-volt)]">
                  38.5% NET
                </span>
              </div>
              <div>
                <span className="font-mono text-[10px] uppercase text-[var(--color-obsidian)]/50 block">
                  BREAK-EVEN
                </span>
                <span className="font-display text-lg font-bold text-[var(--color-obsidian)]">
                  6.8 MONTHS
                </span>
              </div>
            </div>

            {/* Included Deliverables */}
            <ul className="mt-6 space-y-2 font-mono text-xs text-[var(--color-obsidian)]/80">
              <li className="flex items-center gap-2">
                <span className="text-[var(--color-terracotta-volt)] font-bold">✓</span>
                Dual Extraction Bar (Signature Single Origin Bar + Cold Kinetic Lab)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[var(--color-terracotta-volt)] font-bold">✓</span>
                Multi-Zone Spatial Acoustic Architecture with Custom Vinyl Console
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[var(--color-terracotta-volt)] font-bold">✓</span>
                Kinetic Façade Mesh + Dynamic Atmospheric Lighting Control
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[var(--color-terracotta-volt)] font-bold">✓</span>
                Full ERP Cloud Telemetry Suite & Mobile Customer Priority Pipeline
              </li>
            </ul>
          </div>

          {/* Interactive ROI Calculator Card */}
          <div className="p-6 sm:p-8 border-2 border-[var(--color-obsidian)] bg-white/70 shadow-2xl relative">
            <GridCrosshair position="top-left" />
            <GridCrosshair position="top-right" />
            <GridCrosshair position="bottom-left" />
            <GridCrosshair position="bottom-right" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--color-hairline-light)] pb-4">
              <div>
                <span className="font-mono text-xs text-[var(--color-terracotta-volt)] font-bold tracking-widest uppercase">
                  SIMULATOR // ENGINE 2026
                </span>
                <h4 className="font-display text-2xl font-black uppercase text-[var(--color-obsidian)] mt-1">
                  TACTILE ROI CALCULATOR
                </h4>
              </div>
              <span className="font-mono text-xs px-2.5 py-1 bg-[var(--color-obsidian)] text-[var(--color-editorial-bone)] self-start sm:self-auto">
                ACTIVE TIER: {activeFormat === 1 ? "01 COMPACT" : "02 FLAGSHIP"}
              </span>
            </div>

            {/* Sliders Input Group */}
            <div className="mt-6 space-y-6">
              {/* Slider 1: Capital Investment */}
              <div>
                <div className="flex items-center justify-between font-mono text-xs mb-2">
                  <span className="text-[var(--color-obsidian)]/70 uppercase">
                    INITIAL CAPITAL EXPENDITURE (CAPEX)
                  </span>
                  <span className="font-bold text-sm text-[var(--color-obsidian)]">
                    ${investment.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={100000}
                  max={800000}
                  step={25000}
                  value={investment}
                  aria-label="Initial Capital Expenditure Investment Slider"
                  onChange={(e) => setInvestment(Number(e.target.value))}
                  className="w-full h-2 bg-[var(--color-obsidian)]/20 rounded-none accent-[var(--color-terracotta-volt)] cursor-pointer"
                />
                <div className="flex justify-between font-mono text-[10px] text-[var(--color-obsidian)]/40 mt-1">
                  <span>$100K</span>
                  <span>$450K</span>
                  <span>$800K</span>
                </div>
              </div>

              {/* Slider 2: Daily Customer Footfall */}
              <div>
                <div className="flex items-center justify-between font-mono text-xs mb-2">
                  <span className="text-[var(--color-obsidian)]/70 uppercase">
                    PROJECTED DAILY CUSTOMER FOOTFALL
                  </span>
                  <span className="font-bold text-sm text-[var(--color-obsidian)]">
                    {dailyTraffic} GUESTS / DAY
                  </span>
                </div>
                <input
                  type="range"
                  min={150}
                  max={1200}
                  step={25}
                  value={dailyTraffic}
                  aria-label="Projected Daily Customer Footfall Slider"
                  onChange={(e) => setDailyTraffic(Number(e.target.value))}
                  className="w-full h-2 bg-[var(--color-obsidian)]/20 rounded-none accent-[var(--color-terracotta-volt)] cursor-pointer"
                />
                <div className="flex justify-between font-mono text-[10px] text-[var(--color-obsidian)]/40 mt-1">
                  <span>150 GUESTS</span>
                  <span>650 GUESTS</span>
                  <span>1,200 GUESTS</span>
                </div>
              </div>

              {/* Slider 3: Average Order Value */}
              <div>
                <div className="flex items-center justify-between font-mono text-xs mb-2">
                  <span className="text-[var(--color-obsidian)]/70 uppercase">
                    AVERAGE TICKET / ORDER VALUE
                  </span>
                  <span className="font-bold text-sm text-[var(--color-obsidian)]">
                    ${avgTicket} / ORDER
                  </span>
                </div>
                <input
                  type="range"
                  min={18}
                  max={85}
                  step={1}
                  value={avgTicket}
                  aria-label="Average Ticket Order Value Slider"
                  onChange={(e) => setAvgTicket(Number(e.target.value))}
                  className="w-full h-2 bg-[var(--color-obsidian)]/20 rounded-none accent-[var(--color-terracotta-volt)] cursor-pointer"
                />
                <div className="flex justify-between font-mono text-[10px] text-[var(--color-obsidian)]/40 mt-1">
                  <span>$18 (COFFEE + PASTRY)</span>
                  <span>$50 (PAIRING)</span>
                  <span>$85 (EXPERIENCE)</span>
                </div>
              </div>
            </div>

            {/* Calculated Output Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t-2 border-[var(--color-obsidian)]">
              <div className="bg-[var(--color-obsidian)] text-[var(--color-editorial-bone)] p-3">
                <span className="font-mono text-[10px] text-[var(--color-editorial-bone)]/60 block">
                  EST. MONTHLY GROSS
                </span>
                <span className="font-display text-xl font-bold mt-1 block">
                  ${monthlyGrossRevenue.toLocaleString()}
                </span>
              </div>

              <div className="bg-[var(--color-obsidian)] text-[var(--color-editorial-bone)] p-3">
                <span className="font-mono text-[10px] text-[var(--color-editorial-bone)]/60 block">
                  NET MONTHLY PROFIT
                </span>
                <span className="font-display text-xl font-bold text-[var(--color-terracotta-volt)] mt-1 block">
                  ${monthlyNetProfit.toLocaleString()}
                </span>
              </div>

              <div className="bg-[var(--color-obsidian)] text-[var(--color-editorial-bone)] p-3">
                <span className="font-mono text-[10px] text-[var(--color-editorial-bone)]/60 block">
                  BREAK-EVEN HORIZON
                </span>
                <span className="font-display text-xl font-bold mt-1 block">
                  {breakEvenMonths} MO
                </span>
              </div>

              <div className="bg-[var(--color-obsidian)] text-[var(--color-editorial-bone)] p-3">
                <span className="font-mono text-[10px] text-[var(--color-editorial-bone)]/60 block">
                  3-YR NET ROI
                </span>
                <span className="font-display text-xl font-bold text-[var(--color-terracotta-volt)] mt-1 block">
                  +{threeYearRoi}%
                </span>
              </div>
            </div>

            {/* Verification Note */}
            <p className="font-mono text-[10px] text-[var(--color-obsidian)]/50 mt-4 text-center">
              * Modeled on verified historical operating metrics across Mr. BLACK
              flagships in Paris & Milan. Actual yields vary by local footprint and zoning.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
