"use client";

import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";

interface FormatModelViewerProps {
  activeFormat?: 1 | 2;
  interactive?: boolean;
}

export default function FormatModelViewer({
  activeFormat = 1,
  interactive = true,
}: FormatModelViewerProps) {
  const rootGroupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Group>(null);
  const upperSlabRef = useRef<THREE.Group>(null);
  const pillarsRef = useRef<THREE.Group>(null);

  // Smooth interpolation progress: 0 = Format 01 (Compact Core), 1 = Format 02 (Flagship Lounge)
  const currentProgress = useRef(activeFormat === 1 ? 0 : 1);

  // Materials with reusable instances
  const materials = useMemo(() => {
    return {
      darkChassis: new THREE.MeshStandardMaterial({
        color: "#18181b",
        metalness: 0.9,
        roughness: 0.25,
      }),
      brutalistSteel: new THREE.MeshStandardMaterial({
        color: "#27272a",
        metalness: 0.85,
        roughness: 0.35,
      }),
      coreGlow: new THREE.MeshStandardMaterial({
        color: "#ff5500",
        emissive: "#ff5500",
        emissiveIntensity: 2.8,
        toneMapped: false,
      }),
      wireframeAccent: new THREE.MeshBasicMaterial({
        color: "#ff5500",
        wireframe: true,
        transparent: true,
        opacity: 0.65,
      }),
      frostedGlass: new THREE.MeshPhysicalMaterial({
        color: "#f3ece1",
        transmission: 0.85,
        opacity: 0.7,
        transparent: true,
        roughness: 0.15,
        ior: 1.5,
        thickness: 1.2,
      }),
      goldAccent: new THREE.MeshStandardMaterial({
        color: "#f59e0b",
        metalness: 0.95,
        roughness: 0.2,
      }),
    };
  }, []);

  useFrame((state, delta) => {
    const safeDelta = Math.min(delta, 0.064);
    const target = activeFormat === 1 ? 0 : 1;
    // Smooth lerp progress
    currentProgress.current = THREE.MathUtils.damp(
      currentProgress.current,
      target,
      4.0,
      safeDelta
    );
    const p = currentProgress.current;

    // Subtle gentle continuous rotation
    if (rootGroupRef.current) {
      rootGroupRef.current.rotation.y += safeDelta * (0.2 + p * 0.1);

      // Subtle mouse tilt reaction
      if (interactive) {
        const mouseX = state.pointer.x * 0.25;
        const mouseY = state.pointer.y * 0.2;
        rootGroupRef.current.rotation.x = THREE.MathUtils.damp(
          rootGroupRef.current.rotation.x,
          mouseY,
          3.0,
          delta
        );
        rootGroupRef.current.rotation.z = THREE.MathUtils.damp(
          rootGroupRef.current.rotation.z,
          -mouseX * 0.5,
          3.0,
          delta
        );
      }
    }

    // Core pulsing & rotating
    if (coreRef.current) {
      coreRef.current.rotation.x += delta * 0.8;
      coreRef.current.rotation.y += delta * 1.2;
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.08;
      const coreScale = THREE.MathUtils.lerp(1.0, 1.45, p) * pulse;
      coreRef.current.scale.set(coreScale, coreScale, coreScale);
    }

    // Upper slab elevation (Format 01 = compact single floor, Format 02 = elevated double-height)
    if (upperSlabRef.current) {
      const targetY = THREE.MathUtils.lerp(0.85, 1.95, p);
      upperSlabRef.current.position.y = targetY;
      const slabScale = THREE.MathUtils.lerp(1.0, 1.6, p);
      upperSlabRef.current.scale.set(slabScale, 1, slabScale);
    }

    // Outer kinetic ring expansion
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z += delta * 0.5;
      const ringScale = THREE.MathUtils.lerp(1.2, 2.2, p);
      outerRingRef.current.scale.set(ringScale, ringScale, ringScale);
    }

    // Pillars separation outward
    if (pillarsRef.current) {
      const spread = THREE.MathUtils.lerp(0.85, 1.65, p);
      pillarsRef.current.children.forEach((child, idx) => {
        const signX = idx === 0 || idx === 2 ? 1 : -1;
        const signZ = idx === 0 || idx === 1 ? 1 : -1;
        child.position.x = signX * spread;
        child.position.z = signZ * spread;
        child.scale.y = THREE.MathUtils.lerp(1.0, 1.8, p);
      });
    }
  });

  return (
    <group>
      <ambientLight intensity={0.8} />
      <directionalLight position={[6, 8, 5]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-6, -4, -4]} intensity={0.8} color="#ff5500" />
      <pointLight position={[0, 0, 0]} intensity={3.0} color="#ff5500" distance={5} />

      <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.3}>
        <group ref={rootGroupRef} position={[0, -0.3, 0]}>
          {/* Base Foundation Plinth */}
          <mesh position={[0, -0.9, 0]} material={materials.darkChassis}>
            <boxGeometry args={[2.2, 0.25, 2.2]} />
          </mesh>

          {/* Precision Perimeter Ground Wireframe */}
          <mesh position={[0, -0.76, 0]} material={materials.wireframeAccent}>
            <boxGeometry args={[2.3, 0.05, 2.3]} />
          </mesh>

          {/* Kinetic Corner Structural Columns (4 Pillars) */}
          <group ref={pillarsRef}>
            <mesh position={[0.85, 0, 0.85]} material={materials.brutalistSteel}>
              <boxGeometry args={[0.18, 1.6, 0.18]} />
            </mesh>
            <mesh position={[-0.85, 0, 0.85]} material={materials.brutalistSteel}>
              <boxGeometry args={[0.18, 1.6, 0.18]} />
            </mesh>
            <mesh position={[0.85, 0, -0.85]} material={materials.brutalistSteel}>
              <boxGeometry args={[0.18, 1.6, 0.18]} />
            </mesh>
            <mesh position={[-0.85, 0, -0.85]} material={materials.brutalistSteel}>
              <boxGeometry args={[0.18, 1.6, 0.18]} />
            </mesh>
          </group>

          {/* Central Glowing Reactor / Energy Module */}
          <mesh ref={coreRef} position={[0, 0, 0]} material={materials.coreGlow}>
            <octahedronGeometry args={[0.42, 0]} />
          </mesh>

          {/* Enclosing Frosted Glass Chamber */}
          <mesh position={[0, 0, 0]} material={materials.frostedGlass}>
            <boxGeometry args={[1.1, 1.1, 1.1]} />
          </mesh>

          {/* Kinetic Outer Ring (Spatial Perimeter) */}
          <group ref={outerRingRef} position={[0, 0, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.wireframeAccent}>
              <ringGeometry args={[1.15, 1.25, 32]} />
            </mesh>
            <mesh rotation={[Math.PI / 4, 0, 0]} material={materials.goldAccent}>
              <torusGeometry args={[1.2, 0.015, 8, 32]} />
            </mesh>
          </group>

          {/* Upper Cantilevered Slabs / Canopy */}
          <group ref={upperSlabRef} position={[0, 0.85, 0]}>
            <mesh material={materials.darkChassis}>
              <boxGeometry args={[2.4, 0.16, 2.4]} />
            </mesh>
            {/* Skylight aperture with glass */}
            <mesh position={[0, 0.09, 0]} material={materials.frostedGlass}>
              <boxGeometry args={[1.2, 0.05, 1.2]} />
            </mesh>
            <mesh position={[0, 0.12, 0]} material={materials.wireframeAccent}>
              <boxGeometry args={[2.42, 0.02, 2.42]} />
            </mesh>
          </group>
        </group>
      </Float>
    </group>
  );
}
