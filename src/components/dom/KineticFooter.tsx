"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAppStore } from "@/store/useAppStore";
import { useMagneticEffect } from "@/hooks/useMagneticEffect";
import GridCrosshair from "@/components/dom/GridCrosshair";
import { submitContactTerminal, type ContactActionState } from "@/app/actions/contact";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface AccordionItem {
  id: string;
  phase: string;
  title: string;
  duration: string;
  description: string;
  deliverables: string[];
}

const TURNKEY_STAGES: AccordionItem[] = [
  {
    id: "stage-01",
    phase: "PHASE 01",
    title: "STRATEGY & SITE VIABILITY TELEMETRY",
    duration: "10 DAYS",
    description:
      "Algorithmic pedestrian heat-mapping, street-level footfall indexing, and demographic purchasing power analysis to guarantee prime retail coordinates.",
    deliverables: [
      "Footfall Sensor Data Analysis",
      "Demographic Affluence Heatmap",
      "Leasehold Commercial Audit",
      "Preliminary Yield Model",
    ],
  },
  {
    id: "stage-02",
    phase: "PHASE 02",
    title: "SPATIAL ARCHITECTURE & BIM 3D CAD",
    duration: "15 DAYS",
    description:
      "Translating the NOIR brutalist spatial code into millimetric architectural drawings. HVAC airflow simulation, acoustic tuning, and monolithic island fabrication.",
    deliverables: [
      "3D Spatial Digital Twin",
      "Monolithic Bar Metal CAD",
      "Acoustic Reflection Tuning",
      "Lighting Lux Density Matrix",
    ],
  },
  {
    id: "stage-03",
    phase: "PHASE 03",
    title: "HARDWARE SUITE & SENSORY EDGE NODES",
    duration: "12 DAYS",
    description:
      "Delivery and calibration of commercial volumetric espresso machinery, automated bean vacuum dispensers, and edge computing nodes connected to cloud telemetry.",
    deliverables: [
      "Custom Under-Counter Extraction Island",
      "Automated Roasting Node Integration",
      "Edge Camera Telemetry Suite",
      "Cloud ERP Sync Calibration",
    ],
  },
  {
    id: "stage-04",
    phase: "PHASE 04",
    title: "BARISTA & LEADERSHIP INTENSIVE ACADEMY",
    duration: "21 DAYS",
    description:
      "Rigorous hands-on protocol training. Sensory extraction calibration, speed-sprint workflow optimization, and luxury hospitality etiquette standard drills.",
    deliverables: [
      "Sensory Palate Alignment Drills",
      "High-Throughput Sprint Ergonomics",
      "Inventory Depletion Governance",
      "VIP Concierge Protocol",
    ],
  },
  {
    id: "stage-05",
    phase: "PHASE 05",
    title: "GRAND LAUNCH & AUTONOMOUS SCALING",
    duration: "CONTINUOUS",
    description:
      "Zero-latency public opening. Targeted influencer dispersion, local PR coverage, and ongoing automated green bean supply chain logistics.",
    deliverables: [
      "Curated VIP Opening Keynote",
      "Live Revenue Telemetry Dashboard",
      "Automated Bean Logistics Rail",
      "Quarterly Hardware Calibration",
    ],
  },
];

const FAQ_ITEMS = [
  {
    q: "WHAT IS THE EXPECTED TURNKEY TIMELINE FROM CONTRACT TO FIRST EXTRACTION?",
    a: "Format 01 (Compact Core) deploys in exactly 45 calendar days. Format 02 (Flagship Lounge) deploys in 90 calendar days, inclusive of municipal permits and spatial architectural buildout.",
  },
  {
    q: "CAN NOIR // KINETIC BE DEPLOYED OUTSIDE MAJOR CAPITAL METROPOLISES?",
    a: "Yes. Our demographic telemetry engine validates locations in tier-2 growth hubs with verified pedestrian density and high-affinity specialty coffee consumption habits.",
  },
  {
    q: "HOW IS THE TECH INFRASTRUCTURE & ROYALTY FEE CALCULATED?",
    a: "We maintain a transparent 4.5% royalty plus 1.5% tech platform maintenance fee. No hidden supplier markups; all proprietary bean roasting margins remain direct to the partner.",
  },
];

const INITIAL_STATE: ContactActionState = {
  status: "idle",
  message: "",
};

export default function KineticFooter() {
  const isLoaded = useAppStore((s) => s.isLoaded);
  const setActiveTheme = useAppStore((s) => s.setActiveTheme);

  const [openStage, setOpenStage] = useState<string | null>("stage-01");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [state, formAction, isPending] = useActionState(
    submitContactTerminal,
    INITIAL_STATE
  );

  const sectionRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  // Magnetic Back-To-Top button
  const backToTopRef = useMagneticEffect<HTMLButtonElement>({
    strength: 0.4,
    cursorVariant: "hover",
    cursorLabel: "TOP ↑",
  });

  // Magnetic Submit button
  const submitBtnRef = useMagneticEffect<HTMLButtonElement>({
    strength: 0.25,
    cursorVariant: "hover",
    cursorLabel: "SUBMIT",
  });

  // Background Theme Transition: Obsidian <-> Terracotta Volt
  useEffect(() => {
    if (!isLoaded || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: footerRef.current || sectionRef.current,
        start: "top 60%",
        end: "bottom bottom",
        onEnter: () => {
          setActiveTheme("orange");
          gsap.to(document.body, {
            backgroundColor: "oklch(66.5% 0.225 38)",
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
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isLoaded, setActiveTheme]);

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="turnkey"
      className="w-full relative border-t border-[var(--color-hairline-dark)] pt-28 text-[var(--color-editorial-bone)]"
    >
      <GridCrosshair position="top-left" />
      <GridCrosshair position="top-right" />

      {/* Part 1: Turnkey Process Accordion Header */}
      <div className="mb-14">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-[var(--color-terracotta-volt)]" />
          <span className="font-mono text-xs tracking-widest uppercase text-[var(--color-editorial-bone)]/60">
            06 // TURNKEY ARCHITECTURE & SUPPORT MATRIX
          </span>
        </div>
        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight mt-3">
          5-PHASE DEPLOYMENT. <br />
          <span className="text-[var(--color-editorial-bone)]/40">
            ZERO AMBIGUITY EXECUTION.
          </span>
        </h2>
        <p className="font-sans text-base text-[var(--color-editorial-bone)]/70 max-w-2xl mt-4">
          Every franchise and spatial installation follows an unyielding sequence of
          validation, CAD fabrication, equipment deployment, barista training, and
          network launch.
        </p>
      </div>

      {/* Accordion Component: 5 Turnkey Stages */}
      <div className="border border-[var(--color-hairline-dark)] divide-y divide-[var(--color-hairline-dark)] mb-20 bg-black/20 backdrop-blur-sm">
        {TURNKEY_STAGES.map((stage) => {
          const isOpen = openStage === stage.id;
          return (
            <div key={stage.id} className="relative group transition-colors">
              <button
                onClick={() => setOpenStage(isOpen ? null : stage.id)}
                aria-expanded={isOpen}
                aria-controls={`stage-content-${stage.id}`}
                className="w-full p-6 sm:p-8 flex items-center justify-between text-left cursor-pointer hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                  <span className="font-mono text-xs font-bold text-[var(--color-terracotta-volt)] tracking-widest">
                    {stage.phase}
                  </span>
                  <span className="font-display text-xl sm:text-2xl font-bold uppercase tracking-tight">
                    {stage.title}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-[var(--color-editorial-bone)]/50 hidden md:inline">
                    [{stage.duration}]
                  </span>
                  <span
                    className={`font-mono text-2xl text-[var(--color-terracotta-volt)] transition-transform duration-300 ${
                      isOpen ? "rotate-45" : "rotate-0"
                    }`}
                  >
                    +
                  </span>
                </div>
              </button>

              {/* Accordion Content with smooth CSS grid transition */}
              <div
                id={`stage-content-${stage.id}`}
                className={`grid transition-[grid-template-rows] duration-500 ease-[var(--ease-expo-out)] ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="p-6 sm:p-8 pt-0 border-t border-[var(--color-hairline-dark)]/40 space-y-4">
                    <p className="font-sans text-sm sm:text-base text-[var(--color-editorial-bone)]/80 leading-relaxed max-w-3xl">
                      {stage.description}
                    </p>
                    <div className="pt-2">
                      <span className="font-mono text-xs text-[var(--color-terracotta-volt)] uppercase tracking-wider block mb-2">
                        MANDATORY STAGE DELIVERABLES:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {stage.deliverables.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 font-mono text-xs text-[var(--color-editorial-bone)]/70"
                          >
                            <span className="text-[var(--color-terracotta-volt)]">
                              ■
                            </span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Part 2: Frequently Asked Questions (FAQ) */}
      <div className="mb-24">
        <h3 className="font-mono text-xs text-[var(--color-terracotta-volt)] tracking-widest uppercase mb-4">
          [ FREQUENTLY AUDITED QUESTIONS ]
        </h3>
        <div className="border border-[var(--color-hairline-dark)] divide-y divide-[var(--color-hairline-dark)] bg-black/10">
          {FAQ_ITEMS.map((faq, idx) => {
            const isFaqOpen = openFaq === idx;
            return (
              <div key={idx} className="transition-colors">
                <button
                  onClick={() => setOpenFaq(isFaqOpen ? null : idx)}
                  aria-expanded={isFaqOpen}
                  aria-controls={`faq-answer-${idx}`}
                  className="w-full p-5 sm:p-6 flex items-center justify-between text-left cursor-pointer hover:bg-white/[0.02]"
                >
                  <span className="font-mono text-xs sm:text-sm font-medium pr-4">
                    {faq.q}
                  </span>
                  <span
                    className={`font-mono text-lg text-[var(--color-terracotta-volt)] transition-transform duration-300 ${
                      isFaqOpen ? "rotate-45" : "rotate-0"
                    }`}
                  >
                    +
                  </span>
                </button>
                <div
                  id={`faq-answer-${idx}`}
                  className={`grid transition-[grid-template-rows] duration-400 ease-[var(--ease-expo-out)] ${
                    isFaqOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="p-5 sm:p-6 pt-0 font-sans text-xs sm:text-sm text-[var(--color-editorial-bone)]/70 leading-relaxed border-t border-[var(--color-hairline-dark)]/40">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Part 3: Kinetic Footer Canvas Area (Terracotta Volt Background Zone) */}
      <div
        ref={footerRef}
        id="contact"
        className="w-full border-2 border-[var(--color-obsidian)] bg-[var(--color-terracotta-volt)] text-[var(--color-obsidian)] p-6 sm:p-12 relative overflow-hidden transition-colors duration-700 shadow-2xl"
      >
        <GridCrosshair position="top-left" />
        <GridCrosshair position="top-right" />
        <GridCrosshair position="bottom-left" />
        <GridCrosshair position="bottom-right" />

        {/* Infinite Marquee Banner (Seamless Dual-Track) */}
        <div className="overflow-hidden border-b-2 border-[var(--color-obsidian)] pb-6 mb-10 select-none flex w-full">
          <div className="flex shrink-0 w-max items-center animate-marquee">
            <span className="font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-[var(--color-obsidian)] pr-8">
              NOIR // KINETIC — INDUSTRIAL BRUTALISM × 3D SPATIAL ARCHITECTURE — APPOINTMENTS OPEN FOR 2026/2027 WORLDWIDE —
            </span>
            <span className="font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-[var(--color-obsidian)] pr-8">
              NOIR // KINETIC — INDUSTRIAL BRUTALISM × 3D SPATIAL ARCHITECTURE — APPOINTMENTS OPEN FOR 2026/2027 WORLDWIDE —
            </span>
          </div>
          <div className="flex shrink-0 w-max items-center animate-marquee" aria-hidden="true">
            <span className="font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-[var(--color-obsidian)] pr-8">
              NOIR // KINETIC — INDUSTRIAL BRUTALISM × 3D SPATIAL ARCHITECTURE — APPOINTMENTS OPEN FOR 2026/2027 WORLDWIDE —
            </span>
            <span className="font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-[var(--color-obsidian)] pr-8">
              NOIR // KINETIC — INDUSTRIAL BRUTALISM × 3D SPATIAL ARCHITECTURE — APPOINTMENTS OPEN FOR 2026/2027 WORLDWIDE —
            </span>
          </div>
        </div>

        {/* Footer Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Direct Inquiries & Locations (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div>
              <span className="font-mono text-xs font-bold tracking-widest uppercase bg-[var(--color-obsidian)] text-[var(--color-editorial-bone)] px-2.5 py-1">
                CONTACT // TELEMETRY TERMINAL
              </span>
              <h3 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight mt-4 text-[var(--color-obsidian)]">
                JOIN THE ARCHITECTURE. <br />
                ACQUIRE A REGIONAL CODE.
              </h3>
              <p className="font-sans text-sm text-[var(--color-obsidian)]/80 mt-3 leading-relaxed">
                Direct franchise applications, spatial licensing, and bespoke 3D
                collaborations. Transmit your dossier via the encrypted terminal.
              </p>
            </div>

            {/* Tri-City Coordinates */}
            <div className="border-t border-[var(--color-obsidian)]/30 pt-6 space-y-3 font-mono text-xs text-[var(--color-obsidian)]/90">
              <div className="flex justify-between items-center">
                <span className="font-bold">PARIS // STUDIO</span>
                <span>48.8566° N, 2.3522° E</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold">SAINT PETERSBURG // HQ</span>
                <span>59.9343° N, 30.3351° E</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold">JAKARTA // APAC HUB</span>
                <span>6.2088° S, 106.8456° E</span>
              </div>
            </div>
          </div>

          {/* Right Column: React 19 Server Action Terminal Form (7 Columns) */}
          <div className="lg:col-span-7 border-2 border-[var(--color-obsidian)] bg-white/30 backdrop-blur-md p-6 sm:p-8 relative shadow-lg">
            <div className="flex items-center justify-between border-b border-[var(--color-obsidian)]/30 pb-3 mb-6 font-mono text-xs text-[var(--color-obsidian)]">
              <span className="font-bold">[ TERMINAL // STDIN ]</span>
              <span>PROTOCOL: RFC-5322 ENCRYPTED</span>
            </div>

            {/* React 19 useActionState Form */}
            <form action={formAction} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-[var(--color-obsidian)] font-bold mb-1 uppercase">
                  01 // OPERATOR / FIRM NAME
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="E.G. HAUTE CAPITAL GROUP"
                  className="w-full bg-white/80 border border-[var(--color-obsidian)] p-3 text-[var(--color-obsidian)] placeholder-[var(--color-obsidian)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-obsidian)]"
                />
              </div>

              <div>
                <label className="block text-[var(--color-obsidian)] font-bold mb-1 uppercase">
                  02 // DIRECT EMAIL SPECIFICATION
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="OPERATOR@DOMAIN.COM"
                  className="w-full bg-white/80 border border-[var(--color-obsidian)] p-3 text-[var(--color-obsidian)] placeholder-[var(--color-obsidian)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-obsidian)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[var(--color-obsidian)] font-bold mb-1 uppercase">
                    03 // DESIRED FORMAT TIER
                  </label>
                  <select
                    name="formatTier"
                    defaultValue="01 // COMPACT CORE (45-65 M²)"
                    className="w-full bg-white/80 border border-[var(--color-obsidian)] p-3 text-[var(--color-obsidian)] focus:outline-none focus:ring-2 focus:ring-[var(--color-obsidian)] cursor-pointer"
                  >
                    <option value="01 // COMPACT CORE">
                      01 // COMPACT CORE (45–65 M²)
                    </option>
                    <option value="02 // FLAGSHIP LOUNGE">
                      02 // FLAGSHIP LOUNGE (180–320 M²)
                    </option>
                    <option value="CUSTOM BESPOKE SPATIAL">
                      03 // BESPOKE SPATIAL ENTERPRISE
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-[var(--color-obsidian)] font-bold mb-1 uppercase">
                    04 // TARGET LAUNCH TIMELINE
                  </label>
                  <select
                    name="timeline"
                    defaultValue="Q3 2026"
                    className="w-full bg-white/80 border border-[var(--color-obsidian)] p-3 text-[var(--color-obsidian)] focus:outline-none focus:ring-2 focus:ring-[var(--color-obsidian)] cursor-pointer"
                  >
                    <option value="Q3 2026">Q3 2026</option>
                    <option value="Q4 2026">Q4 2026</option>
                    <option value="Q1 2027">Q1 2027</option>
                    <option value="EXPEDITED 45-DAY">EXPEDITED 45-DAY SPRINT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[var(--color-obsidian)] font-bold mb-1 uppercase">
                  05 // TERRITORIAL NOTES / REMARKS
                </label>
                <textarea
                  name="notes"
                  rows={3}
                  placeholder="INCLUDE METROPOLITAN TARGET, CURRENT COMMERCIAL ASSETS, OR UNIQUE REQUIREMENTS..."
                  className="w-full bg-white/80 border border-[var(--color-obsidian)] p-3 text-[var(--color-obsidian)] placeholder-[var(--color-obsidian)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-obsidian)] resize-none"
                />
              </div>

              {/* Status Message from Server Action */}
              {state.status === "error" && (
                <div className="p-3 bg-red-600 text-white font-mono text-xs border border-black">
                  {state.message}
                </div>
              )}
              {state.status === "success" && (
                <div className="p-3 bg-[var(--color-obsidian)] text-[var(--color-editorial-bone)] font-mono text-xs border border-black">
                  {state.message}
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  ref={submitBtnRef}
                  type="submit"
                  disabled={isPending}
                  className="px-8 py-3.5 bg-[var(--color-obsidian)] text-[var(--color-editorial-bone)] font-mono text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors cursor-pointer border border-[var(--color-obsidian)] disabled:opacity-50"
                >
                  {isPending ? "TRANSMITTING TELEMETRY..." : "TRANSMIT DOSSIER →"}
                </button>
                <span className="font-mono text-[10px] text-[var(--color-obsidian)]/60 hidden sm:inline">
                  STRICT CONFIDENTIALITY // ZERO LEAKS
                </span>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Bar: Back to Top & Copyright */}
        <div className="mt-14 pt-6 border-t border-[var(--color-obsidian)]/40 flex flex-col sm:flex-row items-center justify-between font-mono text-xs text-[var(--color-obsidian)]/80 gap-4">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-[var(--color-obsidian)]" />
            <span>NOIR // KINETIC © 2026. ALL RIGHTS RESERVED.</span>
          </div>

          <button
            ref={backToTopRef}
            onClick={scrollToTop}
            className="px-4 py-2 border border-[var(--color-obsidian)] font-mono text-xs font-bold uppercase hover:bg-[var(--color-obsidian)] hover:text-[var(--color-editorial-bone)] transition-colors cursor-pointer flex items-center gap-2"
          >
            <span>BACK TO TOP</span>
            <span>↑</span>
          </button>
        </div>
      </div>
    </section>
  );
}
