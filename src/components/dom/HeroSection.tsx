"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useAppStore } from "@/store/useAppStore";
import { useMagneticEffect } from "@/hooks/useMagneticEffect";
import GridCrosshair from "@/components/dom/GridCrosshair";
import { View, PerspectiveCamera } from "@react-three/drei";
import HeroMetallicMesh from "@/components/canvas/HeroMetallicMesh";

export default function HeroSection() {
  const isLoaded = useAppStore((s) => s.isLoaded);
  const heroRef = useRef<HTMLElement>(null);
  const titleLinesRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  // Magnetic CTA buttons & badges
  const applyBtnRef = useMagneticEffect<HTMLButtonElement>({
    strength: 0.35,
    cursorVariant: "hover",
    cursorLabel: "APPLY",
  });

  const askBadgeRef = useMagneticEffect<HTMLDivElement>({
    strength: 0.4,
    cursorVariant: "hover",
    cursorLabel: "ASK US",
  });

  const awardBadgeRef = useMagneticEffect<HTMLDivElement>({
    strength: 0.3,
    cursorVariant: "hover",
    cursorLabel: "HONORS",
  });

  useEffect(() => {
    if (!isLoaded || !heroRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // 1. Container entrance
      tl.fromTo(
        heroRef.current,
        { opacity: 0, scale: 0.98 },
        { opacity: 1, scale: 1, duration: 1.0, ease: "expo.out" }
      )
        // 2. Monolithic wordmark reveal
        .fromTo(
          titleLinesRef.current,
          { opacity: 0, scale: 0.92 },
          { opacity: 1, scale: 1, duration: 1.2, ease: "power4.out" },
          "-=0.7"
        )
        // 4. CTA Button
        .fromTo(
          ctaRef.current,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
          "-=0.6"
        )
        // 5. Bottom brutalist statistic cards
        .fromTo(
          cardsRef.current?.children ? Array.from(cardsRef.current.children) : [],
          { y: 35, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: "power3.out" },
          "-=0.5"
        );
    }, heroRef);

    return () => ctx.revert();
  }, [isLoaded]);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="my-10 md:my-14 relative border border-[var(--color-hairline-dark)] p-6 sm:p-8 md:p-14 group will-change-transform"
      style={{ opacity: 0 }}
    >
      <GridCrosshair position="top-left" />
      <GridCrosshair position="top-right" />
      <GridCrosshair position="bottom-left" />
      <GridCrosshair position="bottom-right" />

      {/* Floating SOTD // HONORS Badge on Left Edge */}
      <div
        ref={awardBadgeRef}
        role="region"
        aria-label="Site of the Day Honors 2026"
        className="hidden xl:flex absolute top-1/2 -left-8 -translate-y-1/2 z-20 flex-col items-center justify-center p-3 border border-[var(--color-hairline-dark)] bg-[var(--color-obsidian)]/90 backdrop-blur-md group/badge hover:border-[var(--color-terracotta-volt)] transition-colors cursor-pointer select-none"
      >
        <span className="font-mono text-[9px] tracking-[0.25em] text-[var(--color-editorial-bone)]/50 uppercase [writing-mode:vertical-lr] rotate-180">
          SOTD // HONORS
        </span>
        <span className="h-6 w-[1px] bg-[var(--color-terracotta-volt)] my-2" />
        <span className="font-mono text-[10px] text-[var(--color-terracotta-volt)] font-bold">
          2026
        </span>
      </div>

      {/* Top Manifesto Header & Action Bar */}
      <div className="mb-6 flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-20">
        {/* Left: Editorial Manifesto & Tactile Pill Button */}
        <div className="max-w-xl">
          <div className="flex items-center gap-3 mb-3">
            <span className="font-mono text-xs tracking-[0.25em] text-[var(--color-terracotta-volt)] uppercase">
              NOIR // KINETIC • SYS SPEC 2026
            </span>
            <span className="h-[1px] w-12 bg-[var(--color-hairline-dark)] hidden sm:block" />
          </div>

          <h2 className="font-sans text-xl sm:text-2xl md:text-3xl font-medium tracking-tight text-[var(--color-editorial-bone)] leading-snug">
            Not a template, an architecture. <br />
            <span className="text-[var(--color-editorial-bone)]/60">
              Because Noir is Kinetic.
            </span>
          </h2>

          <div ref={ctaRef} className="mt-5 flex flex-wrap items-center gap-4">
            <button
              ref={applyBtnRef}
              aria-label="Apply For Regional Code - 6-month turnkey payback application"
              onClick={() => {
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-6 py-2.5 rounded-full font-mono text-xs uppercase tracking-widest bg-[var(--color-obsidian)] text-[var(--color-editorial-bone)] border border-[var(--color-hairline-dark)] hover:border-[var(--color-terracotta-volt)] hover:text-[var(--color-terracotta-volt)] transition-all cursor-pointer flex items-center gap-2 group shadow-xl backdrop-blur-md"
            >
              <span>APPLY FOR CODE</span>
              <span className="font-bold group-hover:translate-x-1 transition-transform">
                →
              </span>
            </button>
            <span className="font-mono text-xs text-[var(--color-editorial-bone)]/40 tracking-wider">
              [ 6-MONTH TURNKEY PAYBACK ]
            </span>
          </div>
        </div>

        {/* Right: Studio Telemetry Overview */}
        <div className="hidden md:flex flex-col items-end text-right font-mono text-xs text-[var(--color-editorial-bone)]/50 tracking-wider space-y-1">
          <span className="text-[var(--color-terracotta-volt)] font-bold">
            SEC 01 // OVERVIEW
          </span>
          <span>PARIS [48.85°N] // JAKARTA [6.20°S]</span>
          <span>NEXT 16 + REACT 19.3 COMPILER</span>
        </div>
      </div>

      {/* Center Stage: Monolithic Edge-to-Edge Typography + Centered 3D Canvas Tunnel */}
      <div className="relative my-4 sm:my-10 flex items-center justify-center min-h-[300px] sm:min-h-[440px] md:min-h-[500px] lg:min-h-[560px] overflow-visible">
        {/* Giant Monolithic Wordmark (Nothin' Creative Studio style) */}
        <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none z-0">
          <h1
            ref={titleLinesRef}
            className="font-display font-black text-[11.5vw] sm:text-[13.2vw] tracking-tighter uppercase leading-none text-transparent [-webkit-text-stroke:1.2px_rgba(243,236,225,0.22)] lg:[-webkit-text-stroke:2px_rgba(243,236,225,0.26)] flex items-center justify-between w-full"
          >
            <span>NOIR</span>
            <span className="text-[var(--color-terracotta-volt)]/40 font-light mx-2 sm:mx-4 md:mx-6">
              {"//"}
            </span>
            <span>KINETIC</span>
          </h1>
        </div>

        {/* Centered 3D Kinetic Sculpture View Tunnel */}
        <div className="w-full h-[300px] sm:h-[440px] md:h-[500px] lg:h-[560px] relative z-10 flex items-center justify-center [touch-action:pan-y]">
          <View className="w-full h-full relative cursor-grab active:cursor-grabbing select-none [touch-action:pan-y]">
            <PerspectiveCamera makeDefault position={[0, 0, 5.4]} fov={45} />
            <HeroMetallicMesh />
          </View>
        </div>
      </div>

      {/* Floating Circular Rotating Magnetic Badge (ASK US) */}
      <div
        ref={askBadgeRef}
        role="button"
        tabIndex={0}
        aria-label="Ask Us - Consult spatial architecture"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
          }
        }}
        onClick={() => {
          document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
        }}
        className="hidden sm:flex absolute -bottom-10 right-6 md:right-12 z-20 w-24 h-24 md:w-28 md:h-28 rounded-full border border-[var(--color-hairline-dark)] bg-[var(--color-obsidian)]/90 backdrop-blur-md items-center justify-center cursor-pointer group hover:border-[var(--color-terracotta-volt)] transition-colors"
      >
        <div className="absolute inset-0 flex items-center justify-center animate-[spin_14s_linear_infinite]">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full fill-current text-[var(--color-editorial-bone)]/60 text-[9px] font-mono tracking-widest uppercase select-none"
          >
            <path
              id="circlePath"
              d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
              fill="none"
            />
            <text>
              <textPath href="#circlePath" startOffset="0%">
                • ASK US • NOIR // KINETIC • 3D SPATIAL •
              </textPath>
            </text>
          </svg>
        </div>
        <span className="font-display font-black text-xs text-[var(--color-terracotta-volt)] group-hover:scale-110 transition-transform">
          ASK
        </span>
      </div>

      {/* 3 Metric Cards — Mr. BLACK Architecture Spec */}
      <div
        ref={cardsRef}
        className="mt-12 grid grid-cols-1 md:grid-cols-3 border-t border-[var(--color-hairline-dark)]"
      >
        <div className="brutalist-cell p-6 group/card hover:bg-white/[0.02] transition-colors relative">
          <GridCrosshair position="top-left" />
          <p className="font-mono text-xs text-[var(--color-editorial-bone)]/50 tracking-wider">
            01 // ANNUAL NETWORK REVENUE
          </p>
          <p className="font-display text-3xl md:text-4xl font-bold mt-2 text-[var(--color-editorial-bone)]">
            $683K+
          </p>
          <p className="font-mono text-xs text-[var(--color-editorial-bone)]/60 mt-2">
            Annual Network Revenue Generated
          </p>
        </div>

        <div className="brutalist-cell p-6 group/card hover:bg-white/[0.02] transition-colors relative">
          <GridCrosshair position="top-left" />
          <p className="font-mono text-xs text-[var(--color-editorial-bone)]/50 tracking-wider">
            02 // OPERATING PROFIT
          </p>
          <p className="font-display text-3xl md:text-4xl font-bold mt-2 text-[var(--color-terracotta-volt)]">
            31% MARGIN
          </p>
          <p className="font-mono text-xs text-[var(--color-editorial-bone)]/60 mt-2">
            7% Above Industry Benchmark
          </p>
        </div>

        <div className="p-6 group/card hover:bg-white/[0.02] transition-colors relative">
          <GridCrosshair position="top-left" />
          <p className="font-mono text-xs text-[var(--color-editorial-bone)]/50 tracking-wider">
            03 // RECOVERY PERIOD
          </p>
          <p className="font-display text-3xl md:text-4xl font-bold mt-2 text-[var(--color-editorial-bone)]">
            6 MONTHS
          </p>
          <p className="font-mono text-xs text-[var(--color-editorial-bone)]/60 mt-2">
            Average Turnkey Payback Period
          </p>
        </div>
      </div>
    </section>
  );
}
