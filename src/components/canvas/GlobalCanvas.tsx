"use client";

import { Suspense, useSyncExternalStore } from "react";
import { Canvas } from "@react-three/fiber";
import { View, Preload } from "@react-three/drei";
import { useGpuTier } from "@/hooks/useGpuTier";

const emptySubscribe = () => () => {};

export default function GlobalCanvas() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const { dpr, isLowTier, prefersReducedMotion } = useGpuTier();

  if (!mounted) {
    return <div className="fixed inset-0 pointer-events-none z-[15]" aria-hidden="true" />;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-[15] overflow-hidden">
      <Canvas
        dpr={dpr}
        frameloop={prefersReducedMotion ? "demand" : "always"}
        gl={{
          antialias: !isLowTier,
          alpha: true,
          powerPreference: isLowTier ? "low-power" : "high-performance",
          precision: isLowTier ? "mediump" : "highp",
        }}
        eventSource={document.body}
        eventPrefix="client"
        camera={{ position: [0, 0, 5], fov: 45 }}
      >
        <Suspense fallback={null}>
          <View.Port />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
