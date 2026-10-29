"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAppStore } from "@/store/useAppStore";
import { useMagneticEffect } from "@/hooks/useMagneticEffect";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SpatialGallerySection() {
  const trackRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const museumBgRef = useRef<HTMLDivElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const reflectionRef = useRef<HTMLDivElement>(null);
  const mainVideoRef = useRef<HTMLVideoElement>(null);
  const reflectionVideoRef = useRef<HTMLVideoElement>(null);

  const [isMuted, setIsMuted] = useState(true);
  const prefersReducedMotion = useAppStore((s) => s.prefersReducedMotion);
  const isLoaded = useAppStore((s) => s.isLoaded);

  const soundBtnRef = useMagneticEffect<HTMLButtonElement>({
    strength: 0.35,
    cursorVariant: "hover",
    cursorLabel: "SOUND",
  });

  // Toggle video audio
  const toggleSound = () => {
    if (!mainVideoRef.current) return;
    const newMuted = !isMuted;
    mainVideoRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  // Synchronize playback between main video and floor reflection
  useEffect(() => {
    const main = mainVideoRef.current;
    const reflect = reflectionVideoRef.current;
    if (!main || !reflect) return;

    const syncPlayback = () => {
      if (Math.abs(main.currentTime - reflect.currentTime) > 0.15) {
        reflect.currentTime = main.currentTime;
      }
    };

    main.addEventListener("timeupdate", syncPlayback);
    main.play().catch(() => {});
    reflect.play().catch(() => {});

    return () => {
      main.removeEventListener("timeupdate", syncPlayback);
    };
  }, []);

  // GSAP ScrollTrigger: Cinematic Dolly Zoom Out (Full Screen ➔ Museum Wall)
  useEffect(() => {
    if (!isLoaded || !trackRef.current || !videoWrapperRef.current || prefersReducedMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trackRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
        },
      });

      // 1. Deep Dolly Zoom Out with viewport media query
      const mm = gsap.matchMedia();
      mm.add("(max-width: 767px)", () => {
        tl.fromTo(
          videoWrapperRef.current,
          { scale: 1.8, y: 0 },
          { scale: 0.88, y: 0, ease: "power1.inOut" },
          0
        );
      });
      mm.add("(min-width: 768px)", () => {
        tl.fromTo(
          videoWrapperRef.current,
          { scale: 2.2, y: 0 },
          { scale: 0.68, y: 0, ease: "power1.inOut" },
          0
        );
      });

      // 2. Museum background room dollies out simultaneously (2.0 ➔ 1.0)
      if (museumBgRef.current) {
        tl.fromTo(
          museumBgRef.current,
          { scale: 2.0 },
          { scale: 1.0, ease: "power1.inOut" },
          0
        );
      }

      // 3. Floor reflection fades in as camera pulls back and floor enters view
      if (reflectionRef.current) {
        tl.fromTo(
          reflectionRef.current,
          { opacity: 0 },
          { opacity: 0.75, ease: "power1.inOut" },
          0.15
        );
      }
    }, trackRef);

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [isLoaded, prefersReducedMotion]);

  return (
    <section
      ref={trackRef}
      id="gallery"
      className="w-screen relative left-1/2 -translate-x-1/2 h-[180vh] md:h-[300vh] bg-black overflow-clip"
    >
      {/* Sticky Viewport Container (Locks in place during scroll scrub) */}
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full overflow-hidden bg-black flex items-center justify-center select-none z-10"
      >
        {/* Architectural 3D Concrete Museum Background (Nothin' Creative Studio Spec) */}
        <div
          ref={museumBgRef}
          className="absolute inset-0 w-full h-full bg-cover bg-center z-0 will-change-transform pointer-events-none origin-center"
          style={{
            backgroundImage: `url("https://noth-in.b-cdn.net/freepik__photography-frontal-shot-of-a-huge-large-169-white__495122.webp")`,
          }}
        />

        {/* Top Sound Toggle Capsule (Pinned over video, Nothin' Style) */}
        <div className="absolute top-6 sm:top-8 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
          <button
            ref={soundBtnRef}
            onClick={toggleSound}
            aria-label={isMuted ? "Turn sound ON" : "Turn sound OFF"}
            className="flex items-center gap-3 px-5 py-2 rounded-full font-mono text-xs uppercase tracking-widest bg-black/60 hover:bg-black/80 text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer shadow-2xl"
          >
            <span className="font-bold">SOUND</span>
            <div className="w-8 h-4 rounded-full bg-white/20 p-0.5 flex items-center transition-colors">
              <div
                className={`w-3 h-3 rounded-full transition-transform ${
                  !isMuted
                    ? "translate-x-4 bg-[var(--color-terracotta-volt)]"
                    : "translate-x-0 bg-white"
                }`}
              />
            </div>
            <span className="text-[10px] opacity-70">
              [{isMuted ? "MUTED" : "LIVE"}]
            </span>
          </button>
        </div>

        {/* Minimal Peripheral HUD Markers */}
        <div className="absolute top-6 left-6 z-30 pointer-events-none hidden md:flex items-center gap-2 font-mono text-[11px] text-white/50 tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-terracotta-volt)] animate-pulse" />
          <span>NOIR // SPATIAL EXHIBITION</span>
        </div>

        <div className="absolute bottom-6 left-6 z-30 pointer-events-none hidden md:block font-mono text-[10px] text-white/40 tracking-widest uppercase">
          LOC: PARIS EXHIBITION ARCHIVE
        </div>

        <div className="absolute bottom-6 right-6 z-30 pointer-events-none hidden md:block font-mono text-[10px] text-[var(--color-terracotta-volt)] tracking-widest uppercase">
          [ SCROLL TO DOLLY ZOOM ]
        </div>

        {/* Center Screen Assembly: 16:9 Cinema Screen with Dual-Video & Reflection */}
        <div
          ref={videoWrapperRef}
          className="relative z-10 w-[90vw] sm:w-[75vw] lg:w-[54vw] max-w-[1150px] aspect-video flex flex-col items-center justify-center will-change-transform origin-center"
        >
          {/* Main 16:9 Cinema Frame (Border-free, clean video display) */}
          <div className="w-full h-full relative overflow-hidden bg-black shadow-[0_25px_80px_rgba(0,0,0,0.95)]">
            {/* Primary Video Player */}
            <video
              ref={mainVideoRef}
              src="https://noth-in.b-cdn.net/NOTHIN_MANIFESTE_CLEAN.mp4"
              autoPlay
              loop
              muted={isMuted}
              playsInline
              crossOrigin="anonymous"
              className="w-full h-full object-cover bg-black"
            />

            {/* Subtle Clean Cinema Border Overlay */}
            <Image
              src="https://cdn.prod.website-files.com/6a0c501c42b9751b78a9d1a7/6a281a4f86f15756a04aa88e_test-cadre-transparent-p-1600.webp"
              alt=""
              fill
              unoptimized
              className="pointer-events-none z-10 opacity-70 object-fill"
            />
          </div>

          {/* Real-Time Floor Mirror Reflection */}
          <div
            ref={reflectionRef}
            className="absolute top-[100%] left-0 right-0 h-[48%] overflow-hidden pointer-events-none select-none blur-[14px] opacity-0 transform scale-y-[-1] mt-2 will-change-transform"
            style={{
              maskImage: "linear-gradient(to top, rgba(0,0,0,0.85) 15%, transparent 95%)",
              WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0.85) 15%, transparent 95%)",
            }}
          >
            <video
              ref={reflectionVideoRef}
              src="https://noth-in.b-cdn.net/NOTHIN_MANIFESTE_REFLECT_H265.mp4"
              autoPlay
              loop
              muted
              playsInline
              crossOrigin="anonymous"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
