"use client";

import { useEffect, useRef } from "react";
import { useAppStore } from "@/store/useAppStore";

export interface GpuTierResult {
  tier: 1 | 2 | 3;
  dpr: number | [number, number];
  isMobile: boolean;
  isLowTier: boolean;
  prefersReducedMotion: boolean;
  enablePostProcessing: boolean;
}

export function useGpuTier(): GpuTierResult {
  const tier = useAppStore((s) => s.gpuTier);
  const isMobileDevice = useAppStore((s) => s.isMobile);
  const isReducedMotion = useAppStore((s) => s.prefersReducedMotion);
  const setGpuTier = useAppStore((s) => s.setGpuTier);
  const setIsMobile = useAppStore((s) => s.setIsMobile);
  const setPrefersReducedMotion = useAppStore((s) => s.setPrefersReducedMotion);

  const fpsMonitorFramesRef = useRef(0);
  const lastTimeRef = useRef(0);
  const lowFpsCountRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Mobile Detection (Touch Points, User Agent & Viewport)
    const ua = navigator.userAgent || "";
    const isMobileUA =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const hasTouch = navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth < 768;
    const detectedMobile = isMobileUA || (hasTouch && isSmallScreen);

    // 2. Prefers Reduced Motion Detection & Live Listener
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = (e: MediaQueryListEvent | MediaQueryList) => {
      setPrefersReducedMotion(e.matches);
    };

    if (motionQuery.addEventListener) {
      motionQuery.addEventListener("change", updateMotion);
    } else {
      motionQuery.addListener(updateMotion);
    }

    // 3. GPU Hardware & WebGL Renderer Tier Assessment
    let assessedTier: 1 | 2 | 3 = 2;

    try {
      const canvas = document.createElement("canvas");
      const gl =
        (canvas.getContext("webgl") as WebGLRenderingContext | null) ||
        (canvas.getContext(
          "experimental-webgl"
        ) as WebGLRenderingContext | null);

      if (!gl) {
        assessedTier = 1;
      } else {
        const ext = gl.getExtension("WEBGL_debug_renderer_info");
        const renderer = ext
          ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)?.toLowerCase() || ""
          : "";

        const concurrency = navigator.hardwareConcurrency || 4;
        // @ts-expect-error deviceMemory is supported in Chromium browsers
        const memory = navigator.deviceMemory || 4;

        // Low-end mobile / integrated software indicators
        const isLowGpu =
          renderer.includes("swiftshader") ||
          renderer.includes("llvmpipe") ||
          renderer.includes("mali-4") ||
          renderer.includes("mali-t") ||
          renderer.includes("adreno (tm) 3") ||
          renderer.includes("adreno (tm) 4") ||
          renderer.includes("adreno (tm) 5") ||
          renderer.includes("powervr") ||
          renderer.includes("intel hd");

        // High-end desktop / discrete GPU indicators
        const isHighGpu =
          renderer.includes("nvidia") ||
          renderer.includes("geforce") ||
          renderer.includes("rtx") ||
          renderer.includes("radeon rx") ||
          renderer.includes("apple m") ||
          renderer.includes("apple a1") ||
          (concurrency >= 8 && memory >= 8 && !detectedMobile);

        if (detectedMobile || isLowGpu || concurrency < 4 || memory < 4) {
          assessedTier = 1;
        } else if (isHighGpu) {
          assessedTier = 3;
        } else {
          assessedTier = 2;
        }
      }
    } catch {
      assessedTier = detectedMobile ? 1 : 2;
    }

    // Defer store synchronization to avoid cascading renders
    queueMicrotask(() => {
      setIsMobile(detectedMobile);
      setPrefersReducedMotion(motionQuery.matches);
      setGpuTier(assessedTier);
    });

    // 4. Dynamic Frame-rate Watchdog: Downgrade tier to 1 if consecutive frame drops detected
    let animId: number;
    lastTimeRef.current = performance.now();

    const checkFps = (time: number) => {
      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;

      // Check after initial warming frames
      if (fpsMonitorFramesRef.current > 30 && fpsMonitorFramesRef.current < 150) {
        // Delta > 28.5ms indicates < 35 FPS
        if (delta > 28.5) {
          lowFpsCountRef.current += 1;
          if (lowFpsCountRef.current > 8 && assessedTier > 1) {
            assessedTier = 1;
            setGpuTier(1);
          }
        }
      }

      fpsMonitorFramesRef.current += 1;
      if (fpsMonitorFramesRef.current < 160) {
        animId = requestAnimationFrame(checkFps);
      }
    };

    animId = requestAnimationFrame(checkFps);

    return () => {
      if (motionQuery.removeEventListener) {
        motionQuery.removeEventListener("change", updateMotion);
      } else {
        motionQuery.removeListener(updateMotion);
      }
      cancelAnimationFrame(animId);
    };
  }, [setGpuTier, setIsMobile, setPrefersReducedMotion]);

  const isLowTier = tier === 1 || isMobileDevice;
  const dpr: number | [number, number] =
    isLowTier || isReducedMotion ? 1 : [1, 2];
  const enablePostProcessing = !isLowTier && !isReducedMotion;

  return {
    tier,
    dpr,
    isMobile: isMobileDevice,
    isLowTier,
    prefersReducedMotion: isReducedMotion,
    enablePostProcessing,
  };
}
