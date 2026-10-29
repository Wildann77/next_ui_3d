"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAppStore } from "@/store/useAppStore";
import GridCrosshair from "@/components/dom/GridCrosshair";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type HudTab = "analytics" | "automation" | "inventory";

export default function PocketHudSection() {
  const isLoaded = useAppStore((s) => s.isLoaded);
  const setActiveTheme = useAppStore((s) => s.setActiveTheme);

  const [activeTab, setActiveTab] = useState<HudTab>("analytics");
  const [isGlitching, setIsGlitching] = useState<boolean>(false);
  const [timecode, setTimecode] = useState<string>("00:14:28:00");

  const sectionRef = useRef<HTMLElement>(null);

  // Timecode frame ticker
  useEffect(() => {
    let frame = 0;
    const interval = setInterval(() => {
      frame = (frame + 1) % 60;
      const formattedFrame = frame.toString().padStart(2, "0");
      setTimecode(`00:14:28:${formattedFrame}`);
    }, 1000 / 30);

    return () => clearInterval(interval);
  }, []);

  // Theme transition when entering Pocket HUD section
  useEffect(() => {
    if (!isLoaded || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 60%",
        end: "bottom 40%",
        onEnter: () => {
          setActiveTheme("dark");
          gsap.to(document.body, {
            backgroundColor: "oklch(14.5% 0 0)",
            duration: 0.8,
            ease: "power2.out",
          });
        },
        onLeaveBack: () => {
          setActiveTheme("light");
          gsap.to(document.body, {
            backgroundColor: "oklch(94.1% 0.019 82)",
            duration: 0.8,
            ease: "power2.out",
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isLoaded, setActiveTheme]);

  // Tab switch with scanline/glitch micro-effect
  const switchTab = (tab: HudTab) => {
    if (tab === activeTab) return;
    setIsGlitching(true);
    setActiveTab(tab);
    setTimeout(() => {
      setIsGlitching(false);
    }, 380);
  };

  return (
    <section
      ref={sectionRef}
      id="system"
      className="w-full relative py-28 border-t border-[var(--color-hairline-dark)] text-[var(--color-editorial-bone)]"
    >
      <GridCrosshair position="top-left" />
      <GridCrosshair position="top-right" />

      {/* Section Header */}
      <div className="mb-14">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-[var(--color-terracotta-volt)] animate-pulse" />
          <span className="font-mono text-xs tracking-widest uppercase text-[var(--color-editorial-bone)]/60">
            05 // AUTONOMOUS OPERATING SUITE
          </span>
        </div>
        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight mt-3">
          SYSTEM IN YOUR POCKET. <br />
          <span className="text-[var(--color-editorial-bone)]/40">
            CENTRALIZED TELEMETRY ON GLASS.
          </span>
        </h2>
        <p className="font-sans text-base text-[var(--color-editorial-bone)]/70 max-w-2xl mt-4">
          Control espresso parameters, track live revenue per square meter, dispatch
          predictive bean replenishment, and audit staff throughput from any handheld
          terminal anywhere on Earth.
        </p>
      </div>

      {/* Camera Viewfinder Outer HUD Container */}
      <div className="w-full max-w-5xl mx-auto border-2 border-[var(--color-hairline-dark)] bg-black/40 p-4 sm:p-8 relative overflow-hidden backdrop-blur-md">
        {/* Camera Viewfinder Reticle / Corner Brackets */}
        <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[var(--color-terracotta-volt)] pointer-events-none" />
        <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[var(--color-terracotta-volt)] pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[var(--color-terracotta-volt)] pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[var(--color-terracotta-volt)] pointer-events-none" />

        {/* Central Crosshair Reticle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 pointer-events-none opacity-20">
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[var(--color-editorial-bone)]" />
          <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-[var(--color-editorial-bone)]" />
        </div>

        {/* Top Camera HUD Telemetry Bar */}
        <div className="flex flex-wrap items-center justify-between border-b border-[var(--color-hairline-dark)] pb-4 mb-6 font-mono text-xs text-[var(--color-editorial-bone)]/70 gap-3">
          {/* Left: REC Indicator & Timecode */}
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-2 py-0.5 bg-[var(--color-terracotta-volt)]/20 border border-[var(--color-terracotta-volt)] text-[var(--color-terracotta-volt)] font-bold">
              <span className="h-2 w-2 rounded-full bg-[var(--color-terracotta-volt)] animate-ping" />
              REC ●
            </span>
            <span className="tracking-widest font-bold text-[var(--color-editorial-bone)]">
              {timecode}
            </span>
            <span className="text-[var(--color-editorial-bone)]/40 hidden sm:inline">
              {"// 4K UHD RAW"}
            </span>
          </div>

          {/* Center: Live FPS Counter & Sensor Coordinates */}
          <div className="hidden md:flex items-center gap-4 text-[11px] text-[var(--color-editorial-bone)]/50">
            <span>FPS: 60.0 LOCKED</span>
            <span>POS: [X: +107.629 Y: -06.208]</span>
          </div>

          {/* Right: Battery & Network */}
          <div className="flex items-center gap-3">
            <span className="px-1.5 py-0.5 border border-[var(--color-hairline-dark)] text-[10px]">
              {"5G // 12MS"}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px]">PWR 84%</span>
              <div className="w-6 h-3 border border-[var(--color-editorial-bone)]/60 p-0.5 flex">
                <div className="w-4 h-full bg-[var(--color-terracotta-volt)]" />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Selector Controls (Brutalist Switcher) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-8" role="tablist" aria-label="System module selector">
          <button
            role="tab"
            aria-selected={activeTab === "analytics"}
            aria-label="Module 01: Real-Time Analytics"
            onClick={() => switchTab("analytics")}
            className={`py-3 px-4 font-mono text-xs uppercase tracking-wider text-left transition-all border cursor-pointer ${
              activeTab === "analytics"
                ? "bg-[var(--color-editorial-bone)] text-[var(--color-obsidian)] border-[var(--color-editorial-bone)] font-bold shadow-lg"
                : "bg-white/[0.03] text-[var(--color-editorial-bone)]/70 border-[var(--color-hairline-dark)] hover:border-[var(--color-terracotta-volt)]"
            }`}
          >
            <span className="text-[10px] block opacity-60">MODULE 01</span>
            [01. REAL-TIME ANALYTICS]
          </button>

          <button
            role="tab"
            aria-selected={activeTab === "automation"}
            aria-label="Module 02: AI Automation"
            onClick={() => switchTab("automation")}
            className={`py-3 px-4 font-mono text-xs uppercase tracking-wider text-left transition-all border cursor-pointer ${
              activeTab === "automation"
                ? "bg-[var(--color-editorial-bone)] text-[var(--color-obsidian)] border-[var(--color-editorial-bone)] font-bold shadow-lg"
                : "bg-white/[0.03] text-[var(--color-editorial-bone)]/70 border-[var(--color-hairline-dark)] hover:border-[var(--color-terracotta-volt)]"
            }`}
          >
            <span className="text-[10px] block opacity-60">MODULE 02</span>
            [02. AI AUTOMATION]
          </button>

          <button
            role="tab"
            aria-selected={activeTab === "inventory"}
            aria-label="Module 03: Inventory CRM"
            onClick={() => switchTab("inventory")}
            className={`py-3 px-4 font-mono text-xs uppercase tracking-wider text-left transition-all border cursor-pointer ${
              activeTab === "inventory"
                ? "bg-[var(--color-editorial-bone)] text-[var(--color-obsidian)] border-[var(--color-editorial-bone)] font-bold shadow-lg"
                : "bg-white/[0.03] text-[var(--color-editorial-bone)]/70 border-[var(--color-hairline-dark)] hover:border-[var(--color-terracotta-volt)]"
            }`}
          >
            <span className="text-[10px] block opacity-60">MODULE 03</span>
            [03. INVENTORY CRM]
          </button>
        </div>

        {/* Mobile Device Mockup Frame / Dashboard Container */}
        <div className="w-full max-w-2xl mx-auto rounded-3xl border-2 border-white/20 bg-[#0e0e0e] shadow-2xl p-4 sm:p-6 relative overflow-hidden">
          {/* Device Speaker & Camera Pill Notch */}
          <div className="w-24 h-4 bg-black border border-white/10 rounded-full mx-auto mb-6 flex items-center justify-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500/80" />
            <div className="h-1 w-6 rounded-full bg-white/20" />
          </div>

          {/* CRT Scanline & Glitch Sweep Overlay */}
          {isGlitching && (
            <div className="absolute inset-0 z-30 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,85,0,0.15)_3px,transparent_4px)] animate-pulse" />
          )}

          {/* Screen Content: TAB 01 - ANALYTICS */}
          {activeTab === "analytics" && (
            <div className="space-y-5 animate-[fadeIn_0.3s_ease-out]">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <span className="font-mono text-[10px] text-white/50 block">
                    DAILY TELEMETRY // PARIS FLAGSHIP
                  </span>
                  <span className="font-display text-2xl font-black text-[var(--color-editorial-bone)]">
                    $5,840.50
                  </span>
                </div>
                <span className="font-mono text-xs text-[var(--color-terracotta-volt)] font-bold px-2 py-1 bg-[var(--color-terracotta-volt)]/10 border border-[var(--color-terracotta-volt)]">
                  +22.4% VS AVG
                </span>
              </div>

              {/* Hourly Traffic Bar Graph (SVG) */}
              <div>
                <span className="font-mono text-[10px] text-white/50 mb-2 block uppercase">
                  HOURLY EXTRACTION VOLUME (07:00 — 19:00)
                </span>
                <div className="h-28 w-full flex items-end justify-between gap-1 border-b border-white/15 pb-1">
                  {[28, 45, 92, 115, 84, 62, 78, 120, 105, 88, 54, 30].map(
                    (val, i) => (
                      <div
                        key={i}
                        className="flex-1 flex flex-col items-center gap-1 group relative"
                      >
                        <div
                          className="w-full bg-[var(--color-terracotta-volt)] transition-all duration-500 group-hover:bg-white"
                          style={{ height: `${(val / 120) * 100}%` }}
                        />
                        <span className="text-[8px] font-mono text-white/40">
                          {i + 7}h
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Status Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="border border-white/10 p-3 bg-white/[0.02]">
                  <span className="font-mono text-[10px] text-white/50 block">
                    SEAT DWELL TIME
                  </span>
                  <span className="font-display text-lg font-bold">28.4 MINS</span>
                </div>
                <div className="border border-white/10 p-3 bg-white/[0.02]">
                  <span className="font-mono text-[10px] text-white/50 block">
                    TICKET CONVERSION
                  </span>
                  <span className="font-display text-lg font-bold text-[var(--color-terracotta-volt)]">
                    94.8%
                  </span>
                </div>
                <div className="border border-white/10 p-3 bg-white/[0.02] col-span-2 sm:col-span-1">
                  <span className="font-mono text-[10px] text-white/50 block">
                    STAFF SPRINT EFF.
                  </span>
                  <span className="font-display text-lg font-bold">1.4 CUPS/MIN</span>
                </div>
              </div>
            </div>
          )}

          {/* Screen Content: TAB 02 - AI AUTOMATION */}
          {activeTab === "automation" && (
            <div className="space-y-5 animate-[fadeIn_0.3s_ease-out]">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <span className="font-mono text-[10px] text-white/50 block">
                    NEURAL MACHINE TELEMETRY
                  </span>
                  <span className="font-display text-2xl font-black text-[var(--color-editorial-bone)]">
                    BATCH #882 // ACTIVE
                  </span>
                </div>
                <span className="font-mono text-xs text-emerald-400 font-bold px-2 py-1 bg-emerald-500/10 border border-emerald-500/40">
                  OPTIMAL CURVE
                </span>
              </div>

              {/* Thermal Extraction Diagnostics */}
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center border border-white/10 p-2.5 bg-white/[0.02]">
                  <span className="text-white/60">BOILER TEMPERATURE:</span>
                  <span className="font-bold text-[var(--color-terracotta-volt)]">
                    93.4°C ± 0.1°C
                  </span>
                </div>
                <div className="flex justify-between items-center border border-white/10 p-2.5 bg-white/[0.02]">
                  <span className="text-white/60">EXTRACTION PRESSURE:</span>
                  <span className="font-bold">9.15 BAR VOLUMETRIC</span>
                </div>
                <div className="flex justify-between items-center border border-white/10 p-2.5 bg-white/[0.02]">
                  <span className="text-white/60">AUTONOMOUS GRIND CALIBRATION:</span>
                  <span className="font-bold text-emerald-400">MICRON AUTO-SYNCED</span>
                </div>
              </div>

              {/* Dynamic Surge Pricing Protocol */}
              <div className="border border-white/10 p-3.5 bg-white/[0.02]">
                <div className="flex justify-between items-center mb-2 font-mono text-xs">
                  <span className="text-white/70">DYNAMIC SURGE MARGIN:</span>
                  <span className="text-[var(--color-terracotta-volt)] font-bold">
                    +4.5% MARGIN ADAPTED
                  </span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-none overflow-hidden">
                  <div className="bg-[var(--color-terracotta-volt)] h-full w-[65%]" />
                </div>
                <span className="text-[10px] font-mono text-white/40 mt-1.5 block">
                  Sensor load detects +38% queue density. Margin automated.
                </span>
              </div>
            </div>
          )}

          {/* Screen Content: TAB 03 - INVENTORY CRM */}
          {activeTab === "inventory" && (
            <div className="space-y-5 animate-[fadeIn_0.3s_ease-out]">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <span className="font-mono text-[10px] text-white/50 block">
                    COLD STORAGE & RESERVE TELEMETRY
                  </span>
                  <span className="font-display text-2xl font-black text-[var(--color-editorial-bone)]">
                    120 KG IN VAULT
                  </span>
                </div>
                <span className="font-mono text-xs text-[var(--color-terracotta-volt)] font-bold px-2 py-1 bg-[var(--color-terracotta-volt)]/10 border border-[var(--color-terracotta-volt)]">
                  AUTO-ORDER READY
                </span>
              </div>

              {/* Bean Inventory Progress */}
              <div className="space-y-3 font-mono text-xs">
                <div>
                  <div className="flex justify-between text-white/80 mb-1">
                    <span>ETHIOPIA YIRGACHEFFE (NATURAL)</span>
                    <span className="font-bold">42.5 KG / 60 KG</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5">
                    <div className="bg-[var(--color-terracotta-volt)] h-full w-[70%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-white/80 mb-1">
                    <span>COLOMBIA GEISHA RESERVE</span>
                    <span className="font-bold">18.0 KG / 30 KG</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5">
                    <div className="bg-white h-full w-[60%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-white/80 mb-1">
                    <span>OAT & ALMOND MICRO-EMULSION</span>
                    <span className="font-bold text-[var(--color-terracotta-volt)]">
                      8.5 L (REORDER THRESHOLD)
                    </span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5">
                    <div className="bg-[var(--color-terracotta-volt)] h-full w-[28%]" />
                  </div>
                </div>
              </div>

              {/* VIP Membership CRM Feed */}
              <div className="border border-white/10 p-3 bg-white/[0.02] flex items-center justify-between">
                <div>
                  <span className="font-mono text-[10px] text-white/50 block">
                    VIP BLACK CARD PROTOCOL
                  </span>
                  <span className="font-mono text-xs text-white">
                    84 VIP RESERVES SEATED TODAY
                  </span>
                </div>
                <button className="px-3 py-1 font-mono text-[10px] bg-[var(--color-terracotta-volt)] text-[var(--color-obsidian)] font-bold uppercase hover:bg-white transition-colors cursor-pointer">
                  DISPATCH ORDER
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Camera HUD Optical Parameters */}
        <div className="flex flex-wrap items-center justify-between border-t border-[var(--color-hairline-dark)] pt-4 mt-6 font-mono text-xs text-[var(--color-editorial-bone)]/50 gap-2">
          <span>OPTICS: LEICA APO 35MM</span>
          <span>ISO 400 · 1/250s · f/1.8</span>
          <span>WB 5600K TUNGSTEN</span>
          <span>EXP 0.0 EV</span>
        </div>
      </div>
    </section>
  );
}
