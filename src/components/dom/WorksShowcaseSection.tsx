"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAppStore, type HoveredProject } from "@/store/useAppStore";
import GridCrosshair from "@/components/dom/GridCrosshair";
import { WorkDistortionView } from "@/components/canvas/WorkDistortionPlane";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface PortfolioProject extends HoveredProject {
  client: string;
  tagline: string;
  deliverables: string[];
  metrics: string;
}

const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: "01",
    title: "UTOPIA",
    client: "HAUTE COUTURE PARIS",
    category: "BRANDING",
    year: "2026",
    tagline: "AVANT-GARDE GENERATIVE RUNWAY & IDENTITY ARCHITECTURE",
    image: "/images/portfolio/utopia.webp",
    deliverables: ["Visual Identity System", "Generative Runway Visuals", "OKLCH Color Palette"],
    metrics: "+420% DIGITAL REACH // 1.2M LIVE IMPRESSIONS",
  },
  {
    id: "02",
    title: "AURBSE",
    client: "SPATIAL SOUND SYSTEMS",
    category: "WEBGL",
    year: "2026",
    tagline: "HAPTIC 3D SOUND DISPERSION & BROWSER SYNTHESIS",
    image: "/images/portfolio/aurbse.webp",
    deliverables: ["R3F Audio Reactive Shaders", "Web Audio API Node Graph", "Zero Latency Ticker"],
    metrics: "60 FPS LOCKED // < 12MS AUDIO DISPERSION",
  },
  {
    id: "03",
    title: "IN_COGNITA",
    client: "NEURAL SECURE LABS",
    category: "AI SYSTEMS",
    year: "2025",
    tagline: "AGENTIC THREAT MODELING & DECENTRALIZED COGNITION",
    image: "/images/portfolio/incognita.webp",
    deliverables: ["Local LLM Context Pipeline", "Zero-Knowledge Telemetry", "Tactile HUD Interface"],
    metrics: "99.99% INFERENCE ACCURACY // ZERO LEAKS",
  },
  {
    id: "04",
    title: "HAPTIFY",
    client: "KINETIC HUMAN INTERFACES",
    category: "WEBGL",
    year: "2025",
    tagline: "SPATIAL TELEMETRY GESTURAL INTERFACE FOR PRO DEVICES",
    image: "/images/portfolio/haptify.webp",
    deliverables: ["WebGL Liquid Shader Pipeline", "View Tunnel Scissoring", "Draco GLB Optimizations"],
    metrics: "< 820KB PAYLOAD // ZERO SCROLL JITTER",
  },
  {
    id: "05",
    title: "LGM",
    client: "LUXURY GOODS MATRIX",
    category: "BRANDING",
    year: "2025",
    tagline: "PHYSICAL-DIGITAL TWIN COMMERCE PROTOCOL",
    image: "/images/portfolio/lgm.webp",
    deliverables: ["Editorial 3D Product Configurator", "Next.js 16 App Router", "Server Actions Checkout"],
    metrics: "$1.8M ARR PROCESSED // 3.4X CONVERSION BOOST",
  },
];

const CATEGORIES = ["ALL", "BRANDING", "WEBGL", "AI SYSTEMS"] as const;
type CategoryFilter = (typeof CATEGORIES)[number];

export default function WorksShowcaseSection() {
  const isLoaded = useAppStore((s) => s.isLoaded);
  const setHoveredProject = useAppStore((s) => s.setHoveredProject);
  const setCursorVariant = useAppStore((s) => s.setCursorVariant);
  const setCursorLabel = useAppStore((s) => s.setCursorLabel);

  const [activeFilter, setActiveFilter] = useState<CategoryFilter>("ALL");
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const rowsContainerRef = useRef<HTMLDivElement>(null);

  const filteredProjects =
    activeFilter === "ALL"
      ? PORTFOLIO_PROJECTS
      : PORTFOLIO_PROJECTS.filter((p) => p.category === activeFilter);

  // Row hover handlers connected to Zustand & WorkDistortionPlane (desktop pointer only)
  const handleRowPointerEnter = (project: PortfolioProject) => {
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
      return;
    }
    setHoveredProject(project);
    setCursorVariant("view");
    setCursorLabel("VIEW");
  };

  const handleRowPointerLeave = () => {
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
      return;
    }
    setHoveredProject(null);
    setCursorVariant("default");
    setCursorLabel("");
  };

  // React 19 / View Transitions API integration
  const openProjectDetail = useCallback((project: PortfolioProject) => {
    if (typeof document !== "undefined" && "startViewTransition" in document) {
      document.startViewTransition(() => {
        setSelectedProject(project);
      });
    } else {
      setSelectedProject(project);
    }
  }, []);

  const closeProjectDetail = useCallback(() => {
    if (typeof document !== "undefined" && "startViewTransition" in document) {
      document.startViewTransition(() => {
        setSelectedProject(null);
      });
    } else {
      setSelectedProject(null);
    }
  }, []);

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedProject) {
        closeProjectDetail();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProject, closeProjectDetail]);

  // GSAP Entrance
  useEffect(() => {
    if (!isLoaded || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".work-table-row",
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: rowsContainerRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [isLoaded]);

  return (
    <section
      ref={sectionRef}
      id="works"
      className="my-16 md:my-24 relative border border-[var(--color-hairline-dark)] p-6 sm:p-8 md:p-12 group"
    >
      <GridCrosshair position="top-left" />
      <GridCrosshair position="top-right" />
      <GridCrosshair position="bottom-left" />
      <GridCrosshair position="bottom-right" />

      {/* Embedded Single WebGL Canvas View Tunnel for RGB Wave Hover (desktop only) */}
      <div className="hidden md:block">
        <WorkDistortionView />
      </div>

      {/* Section Header & Category Filter Bar */}
      <div className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[var(--color-hairline-dark)] pb-8 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-xs tracking-[0.25em] text-[var(--color-terracotta-volt)] uppercase">
              ( 03 ) // CURATED ARCHIVE
            </span>
            <span className="h-[1px] w-8 bg-[var(--color-hairline-dark)]" />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight">
            SELECTED WORKS
          </h2>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = activeFilter === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 font-mono text-xs tracking-widest uppercase transition-all border cursor-pointer ${
                  isActive
                    ? "bg-[var(--color-terracotta-volt)] text-[var(--color-obsidian)] font-bold border-[var(--color-terracotta-volt)]"
                    : "border-[var(--color-hairline-dark)] text-[var(--color-editorial-bone)]/60 hover:text-[var(--color-editorial-bone)] hover:border-[var(--color-editorial-bone)]/40 bg-black/20"
                }`}
              >
                ( {cat} )
              </button>
            );
          })}
        </div>
      </div>

      {/* Full-Width Editorial Project Rows Table */}
      <div ref={rowsContainerRef} className="border-t border-[var(--color-hairline-dark)] relative z-10">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            onPointerEnter={() => handleRowPointerEnter(project)}
            onPointerLeave={handleRowPointerLeave}
            onClick={() => openProjectDetail(project)}
            className="work-table-row border-b border-[var(--color-hairline-dark)] py-6 sm:py-8 md:py-10 px-2 sm:px-4 md:px-6 transition-all duration-300 hover:bg-white/[0.03] cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group/row relative overflow-hidden"
          >
            {/* Left: Index, Mobile Mini Thumbnail, & Client */}
            <div className="flex items-center md:items-baseline gap-3 sm:gap-6 md:gap-10 min-w-0 flex-1 w-full md:w-auto">
              <span className="font-mono text-xs text-[var(--color-terracotta-volt)] tracking-widest font-semibold shrink-0">
                ( {project.id} )
              </span>

              {/* Mobile Inline Mini Thumbnail Preview */}
              <div className="md:hidden relative w-12 h-12 shrink-0 overflow-hidden border border-[var(--color-hairline-dark)] bg-black/40">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-display text-xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight break-words group-hover/row:translate-x-2 transition-transform duration-300 text-[var(--color-editorial-bone)]">
                  {project.title}
                </h3>
                <p className="font-mono text-xs text-[var(--color-editorial-bone)]/50 tracking-wider mt-1 uppercase truncate">
                  {project.client}
                </p>
              </div>
            </div>

            {/* Right: Tagline, Category, & Year */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 md:gap-8 font-mono text-xs text-[var(--color-editorial-bone)]/60 shrink-0">
              <span className="hidden xl:inline-block max-w-xs text-[11px] text-[var(--color-editorial-bone)]/40 truncate">
                {project.tagline}
              </span>
              <span className="px-2.5 sm:px-3 py-1 border border-[var(--color-hairline-dark)] text-[var(--color-editorial-bone)]/80">
                {project.category}
              </span>
              <span className="tracking-widest">{project.year}</span>
              <span className="font-bold text-base text-[var(--color-terracotta-volt)] group-hover/row:translate-x-1 transition-transform">
                →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* React 19 View Transitions Detail Drawer / Case Study Modal */}
      {selectedProject && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/80 backdrop-blur-xl animate-[fade-in_0.3s_ease-out]"
          onClick={closeProjectDetail}
        >
          <div
            className="relative w-full max-w-4xl border border-[var(--color-hairline-dark)] bg-[var(--color-obsidian)] p-4 sm:p-8 md:p-10 text-[var(--color-editorial-bone)] shadow-2xl max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <GridCrosshair position="top-left" />
            <GridCrosshair position="top-right" />
            <GridCrosshair position="bottom-left" />
            <GridCrosshair position="bottom-right" />

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[var(--color-hairline-dark)] pb-4 sm:pb-6 mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="font-mono text-xs text-[var(--color-terracotta-volt)] tracking-widest font-bold">
                  CASE STUDY // {selectedProject.id}
                </span>
                <span className="h-[1px] w-4 sm:w-6 bg-[var(--color-hairline-dark)]" />
                <span className="font-mono text-xs text-[var(--color-editorial-bone)]/50">
                  {selectedProject.year}
                </span>
              </div>
              <button
                type="button"
                onClick={closeProjectDetail}
                aria-label="Close project modal"
                className="font-mono text-xs px-2.5 py-1 sm:px-3 sm:py-1.5 border border-[var(--color-hairline-dark)] hover:border-[var(--color-terracotta-volt)] hover:text-[var(--color-terracotta-volt)] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span className="hidden sm:inline">CLOSE</span>
                <span className="font-bold">[ × ]</span>
              </button>
            </div>

            {/* Modal Artwork Preview */}
            <div className="w-full h-48 sm:h-72 md:h-96 relative border border-[var(--color-hairline-dark)] overflow-hidden mb-4 sm:mb-6 bg-black">
              <Image
                src={selectedProject.image}
                alt={selectedProject.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 900px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-obsidian)] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-3 left-3 font-mono text-[10px] sm:text-xs bg-black/70 px-2 sm:px-3 py-1 border border-white/10 text-[var(--color-terracotta-volt)]">
                {selectedProject.metrics}
              </div>
            </div>

            {/* Modal Info */}
            <h3 className="font-display text-2xl sm:text-4xl md:text-5xl font-extrabold uppercase break-words">
              {selectedProject.title}
            </h3>
            <p className="font-mono text-xs text-[var(--color-terracotta-volt)] tracking-wider mt-1">
              CLIENT: {selectedProject.client} • DOMAIN: {selectedProject.category}
            </p>
            <p className="mt-4 font-sans text-sm sm:text-base text-[var(--color-editorial-bone)]/80 leading-relaxed">
              {selectedProject.tagline}. High-density visual synthesis built on bespoke WebGL shaders,
              custom typography architectures, and explicit motion choreography.
            </p>

            {/* Deliverables List */}
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-[var(--color-hairline-dark)]">
              <h4 className="font-mono text-xs uppercase tracking-widest text-[var(--color-editorial-bone)]/50 mb-3 sm:mb-4">
                ENGINEERED DELIVERABLES
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                {selectedProject.deliverables.map((item) => (
                  <div
                    key={item}
                    className="p-2.5 sm:p-3 border border-[var(--color-hairline-dark)] bg-white/[0.02] font-mono text-xs"
                  >
                    <span className="text-[var(--color-terracotta-volt)] mr-2">/</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
