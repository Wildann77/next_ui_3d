"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAppStore } from "@/store/useAppStore";
import GridCrosshair from "@/components/dom/GridCrosshair";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function MetricsBentoSection() {
  const isLoaded = useAppStore((s) => s.isLoaded);
  const setActiveTheme = useAppStore((s) => s.setActiveTheme);

  const sectionRef = useRef<HTMLElement>(null);
  const counter1Ref = useRef<HTMLSpanElement>(null);
  const counter2Ref = useRef<HTMLSpanElement>(null);
  const counter3Ref = useRef<HTMLSpanElement>(null);
  const counter4Ref = useRef<HTMLSpanElement>(null);
  const chartPathRef = useRef<SVGPathElement>(null);

  // Spotlight pointer tracking on bento cells
  const handleCellPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  const handleCellPointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty("--mouse-x", "-999px");
    e.currentTarget.style.setProperty("--mouse-y", "-999px");
  };

  useEffect(() => {
    if (!isLoaded || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Background Theme Transition: Obsidian <-> Industrial Sage
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 55%",
        end: "bottom 45%",
        onEnter: () => {
          setActiveTheme("sage");
          gsap.to(document.body, {
            backgroundColor: "oklch(29.2% 0.018 135)",
            duration: 0.8,
            ease: "power2.out",
          });
        },
        onLeaveBack: () => {
          setActiveTheme("dark");
          gsap.to(document.body, {
            backgroundColor: "oklch(14.5% 0 0)",
            duration: 0.8,
            ease: "power2.out",
          });
        },
        onEnterBack: () => {
          setActiveTheme("sage");
          gsap.to(document.body, {
            backgroundColor: "oklch(29.2% 0.018 135)",
            duration: 0.8,
            ease: "power2.out",
          });
        },
        onLeave: () => {
          setActiveTheme("dark");
          gsap.to(document.body, {
            backgroundColor: "oklch(14.5% 0 0)",
            duration: 0.8,
            ease: "power2.out",
          });
        },
      });

      // 2. Animated Odometer Counters
      const countTargets = {
        fps: 0,
        latency: 0,
        revenue: 0,
        payload: 0,
      };

      gsap.to(countTargets, {
        fps: 60,
        latency: 16,
        revenue: 683,
        payload: 850,
        duration: 2.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true,
        },
        onUpdate: () => {
          if (counter1Ref.current) {
            counter1Ref.current.innerText = `${Math.round(countTargets.fps)} FPS`;
          }
          if (counter2Ref.current) {
            counter2Ref.current.innerText = `< ${Math.round(countTargets.latency)} MS`;
          }
          if (counter3Ref.current) {
            counter3Ref.current.innerText = `$${Math.round(countTargets.revenue)}K+`;
          }
          if (counter4Ref.current) {
            counter4Ref.current.innerText = `< ${Math.round(countTargets.payload)} KB`;
          }
        },
      });

      // 3. SVG Bezier Wave Draw-in Animation
      if (chartPathRef.current) {
        const length = chartPathRef.current.getTotalLength();
        gsap.set(chartPathRef.current, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });

        gsap.to(chartPathRef.current, {
          strokeDashoffset: 0,
          duration: 2.0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 68%",
            once: true,
          },
        });
      }

      // 4. Stagger entrance of the bento cells
      gsap.fromTo(
        ".bento-card-cell",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [isLoaded, setActiveTheme]);

  return (
    <section
      ref={sectionRef}
      id="metrics"
      className="my-16 md:my-24 relative border border-[var(--color-hairline-dark)] p-6 sm:p-8 md:p-12 overflow-hidden transition-colors duration-700 group"
    >
      <GridCrosshair position="top-left" />
      <GridCrosshair position="top-right" />
      <GridCrosshair position="bottom-left" />
      <GridCrosshair position="bottom-right" />

      {/* Faint Giant Brutalist Background Watermark */}
      <div
        aria-hidden="true"
        className="absolute -right-8 -bottom-10 pointer-events-none select-none text-[15vw] font-display font-black text-white/[0.025] leading-none uppercase tracking-tighter"
      >
        METRICS // 02
      </div>

      {/* Section Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[var(--color-hairline-dark)] pb-6 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-xs tracking-[0.25em] text-[var(--color-terracotta-volt)] uppercase">
              ( 02 ) // ARCHITECTURE BENCHMARK
            </span>
            <span className="h-[1px] w-8 bg-[var(--color-hairline-dark)]" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight">
            DYNAMIC METRICS &amp; TELEMETRY
          </h2>
        </div>
        <div className="font-mono text-xs text-[var(--color-editorial-bone)]/50 tracking-wider flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span>REALTIME OKLCH TELEMETRY ACTIVE</span>
        </div>
      </div>

      {/* 4x2 Brutalist Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-[var(--color-hairline-dark)] relative z-10">
        {/* Cell 1: Frame Stability (Span 2 cols) */}
        <div
          onPointerMove={handleCellPointerMove}
          onPointerLeave={handleCellPointerLeave}
          className="bento-card-cell brutalist-cell md:col-span-2 p-6 sm:p-8 relative group overflow-hidden bg-black/20"
          style={{
            backgroundImage:
              "radial-gradient(400px circle at var(--mouse-x, -999px) var(--mouse-y, -999px), rgba(255, 85, 0, 0.16), transparent 75%)",
          }}
        >
          <GridCrosshair position="top-left" />
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-[var(--color-editorial-bone)]/50 tracking-wider">
              01 // FRAME VELOCITY &amp; STABILITY
            </span>
            <span className="font-mono text-[10px] px-2 py-0.5 border border-[var(--color-terracotta-volt)] text-[var(--color-terracotta-volt)]">
              UNIFIED TICKER
            </span>
          </div>

          <div className="mt-4 flex items-baseline gap-4">
            <span
              ref={counter1Ref}
              className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-[var(--color-editorial-bone)]"
            >
              0 FPS
            </span>
            <span className="font-mono text-sm text-[var(--color-terracotta-volt)] font-medium">
              16.4 MS RENDER BUDGET
            </span>
          </div>

          {/* SVG Frame Stability Graph */}
          <div className="mt-6 h-20 w-full relative">
            <svg
              viewBox="0 0 400 80"
              fill="none"
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-terracotta-volt)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="var(--color-terracotta-volt)" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0 50 Q 50 25, 100 45 T 200 35 T 300 40 T 400 30 L 400 80 L 0 80 Z"
                fill="url(#chartGlow)"
              />
              <path
                ref={chartPathRef}
                d="M 0 50 Q 50 25, 100 45 T 200 35 T 300 40 T 400 30"
                stroke="var(--color-terracotta-volt)"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>

          <p className="font-mono text-xs text-[var(--color-editorial-bone)]/60 mt-3 flex items-center justify-between">
            <span>R3F 9.8 + DREI 10.7 + LENIS TIKER</span>
            <span className="text-emerald-400">99.8% STABILITY</span>
          </p>
        </div>

        {/* Cell 2: Interaction Latency (Span 1 col) */}
        <div
          onPointerMove={handleCellPointerMove}
          onPointerLeave={handleCellPointerLeave}
          className="bento-card-cell brutalist-cell p-6 sm:p-8 relative group overflow-hidden bg-black/20"
          style={{
            backgroundImage:
              "radial-gradient(350px circle at var(--mouse-x, -999px) var(--mouse-y, -999px), rgba(255, 85, 0, 0.16), transparent 75%)",
          }}
        >
          <GridCrosshair position="top-left" />
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-[var(--color-editorial-bone)]/50 tracking-wider">
              02 // LATENCY
            </span>
            <div className="h-2 w-2 rounded-full bg-emerald-400" />
          </div>

          <div className="mt-4">
            <span
              ref={counter2Ref}
              className="font-display text-4xl sm:text-5xl font-black text-[var(--color-editorial-bone)]"
            >
              0 MS
            </span>
          </div>

          <p className="font-mono text-xs text-[var(--color-editorial-bone)]/60 mt-2">
            INP Touch-to-Paint Budget
          </p>

          {/* Micro Heartbeat Radar Indicator */}
          <div className="mt-6 flex items-center gap-2">
            <div className="flex-1 h-[2px] bg-[var(--color-hairline-dark)] relative overflow-hidden">
              <div className="absolute inset-y-0 left-0 w-1/3 bg-[var(--color-terracotta-volt)] animate-[marquee_2s_linear_infinite]" />
            </div>
            <span className="font-mono text-[10px] text-[var(--color-editorial-bone)]/50">
              AUDITED
            </span>
          </div>
        </div>

        {/* Cell 3: Monetization Velocity (Span 1 col) */}
        <div
          onPointerMove={handleCellPointerMove}
          onPointerLeave={handleCellPointerLeave}
          className="bento-card-cell brutalist-cell p-6 sm:p-8 relative group overflow-hidden bg-black/20"
          style={{
            backgroundImage:
              "radial-gradient(350px circle at var(--mouse-x, -999px) var(--mouse-y, -999px), rgba(255, 85, 0, 0.16), transparent 75%)",
          }}
        >
          <GridCrosshair position="top-left" />
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-[var(--color-editorial-bone)]/50 tracking-wider">
              03 // ARR TARGET
            </span>
            <span className="font-mono text-[10px] text-emerald-400 font-bold">+31% YOY</span>
          </div>

          <div className="mt-4">
            <span
              ref={counter3Ref}
              className="font-display text-4xl sm:text-5xl font-black text-[var(--color-terracotta-volt)]"
            >
              $0K+
            </span>
          </div>

          <p className="font-mono text-xs text-[var(--color-editorial-bone)]/60 mt-2">
            Annual Network Revenue per Core Node
          </p>

          <div className="mt-6 pt-3 border-t border-[var(--color-hairline-dark)] font-mono text-[10px] text-[var(--color-editorial-bone)]/50 flex justify-between">
            <span>BENCHMARK</span>
            <span className="text-[var(--color-editorial-bone)] font-bold">TOP TIER</span>
          </div>
        </div>

        {/* Cell 4: Compiler Engine (Span 1 col) */}
        <div
          onPointerMove={handleCellPointerMove}
          onPointerLeave={handleCellPointerLeave}
          className="bento-card-cell brutalist-cell p-6 sm:p-8 relative group overflow-hidden bg-black/20"
          style={{
            backgroundImage:
              "radial-gradient(350px circle at var(--mouse-x, -999px) var(--mouse-y, -999px), rgba(255, 85, 0, 0.16), transparent 75%)",
          }}
        >
          <GridCrosshair position="top-left" />
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-[var(--color-editorial-bone)]/50 tracking-wider">
              04 // COMPILER
            </span>
            <span className="font-mono text-[10px] text-[var(--color-terracotta-volt)]">19.3</span>
          </div>

          <div className="mt-4">
            <span className="font-display text-3xl sm:text-4xl font-extrabold text-[var(--color-editorial-bone)] uppercase">
              REACT 19.3
            </span>
          </div>

          <p className="font-mono text-xs text-[var(--color-editorial-bone)]/60 mt-2">
            React Compiler 1.0 Auto-Memoization
          </p>

          <div className="mt-6 pt-3 border-t border-[var(--color-hairline-dark)] font-mono text-[10px] text-[var(--color-editorial-bone)]/50">
            NO DEFENSIVE USEMEMO HOOKS
          </div>
        </div>

        {/* Cell 5: Hybrid View Tunnel Architecture (Span 2 cols) */}
        <div
          onPointerMove={handleCellPointerMove}
          onPointerLeave={handleCellPointerLeave}
          className="bento-card-cell brutalist-cell md:col-span-2 p-6 sm:p-8 relative group overflow-hidden bg-black/20"
          style={{
            backgroundImage:
              "radial-gradient(400px circle at var(--mouse-x, -999px) var(--mouse-y, -999px), rgba(255, 85, 0, 0.16), transparent 75%)",
          }}
        >
          <GridCrosshair position="top-left" />
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-[var(--color-editorial-bone)]/50 tracking-wider">
              05 // HYBRID VIEW TUNNEL ARCHITECTURE
            </span>
            <span className="font-mono text-[10px] px-2 py-0.5 border border-[var(--color-hairline-dark)] text-[var(--color-editorial-bone)]/70">
              PERSISTENT CONTEXT
            </span>
          </div>

          {/* Architecture Visual Diagram */}
          <div className="mt-6 grid grid-cols-3 gap-2 font-mono text-center">
            <div className="p-3 border border-[var(--color-hairline-dark)] bg-black/30">
              <p className="text-[10px] text-[var(--color-editorial-bone)]/50 uppercase">LAYER 01</p>
              <p className="text-xs font-bold mt-1 text-[var(--color-editorial-bone)]">DOM VIEWPORT</p>
            </div>
            <div className="p-3 border border-[var(--color-terracotta-volt)] bg-[var(--color-terracotta-volt)]/10 flex flex-col justify-center items-center">
              <p className="text-[10px] text-[var(--color-terracotta-volt)] uppercase">SCISSOR TUNNEL</p>
              <p className="text-xs font-bold mt-1 text-[var(--color-terracotta-volt)]">&lt;View /&gt;</p>
            </div>
            <div className="p-3 border border-[var(--color-hairline-dark)] bg-black/30">
              <p className="text-[10px] text-[var(--color-editorial-bone)]/50 uppercase">LAYER 02</p>
              <p className="text-xs font-bold mt-1 text-[var(--color-editorial-bone)]">1 WEBGL CANVAS</p>
            </div>
          </div>

          <p className="font-mono text-xs text-[var(--color-editorial-bone)]/60 mt-4">
            Zero WebGL Context Switching. All 3D meshes rendered inside a single persistent hardware loop.
          </p>
        </div>

        {/* Cell 6: Network Asset Budget (Span 1 col) */}
        <div
          onPointerMove={handleCellPointerMove}
          onPointerLeave={handleCellPointerLeave}
          className="bento-card-cell p-6 sm:p-8 relative group overflow-hidden bg-black/20"
          style={{
            backgroundImage:
              "radial-gradient(350px circle at var(--mouse-x, -999px) var(--mouse-y, -999px), rgba(255, 85, 0, 0.16), transparent 75%)",
          }}
        >
          <GridCrosshair position="top-left" />
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-[var(--color-editorial-bone)]/50 tracking-wider">
              06 // 3D ASSET BUDGET
            </span>
            <span className="font-mono text-[10px] text-emerald-400">DRACO / MESHOPT</span>
          </div>

          <div className="mt-4">
            <span
              ref={counter4Ref}
              className="font-display text-4xl sm:text-5xl font-black text-[var(--color-editorial-bone)]"
            >
              0 KB
            </span>
          </div>

          <p className="font-mono text-xs text-[var(--color-editorial-bone)]/60 mt-2">
            Per GLB Model Payload Constraint
          </p>

          <div className="mt-6 pt-3 border-t border-[var(--color-hairline-dark)] font-mono text-[10px] text-[var(--color-editorial-bone)]/50 flex justify-between">
            <span>KTX2 / WEBP</span>
            <span className="text-[var(--color-terracotta-volt)] font-bold">OPTIMIZED</span>
          </div>
        </div>
      </div>
    </section>
  );
}
