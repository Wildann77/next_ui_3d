"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useAppStore } from "@/store/useAppStore";
import vertexShader from "./shaders/liquidChrome.vert.glsl";
import fragmentShader from "./shaders/liquidChrome.frag.glsl";

// Fallback shaders in case bundler loader string is empty
const fallbackVert = `
varying vec3 vNormal;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;
varying vec2 vUv;
varying float vDisplacement;
uniform float uTime;
uniform vec2 uMouse;
uniform float uVelocity;
uniform float uHover;

void main() {
  vUv = uv;
  float wave = sin(position.x * 2.5 + uTime * 1.2) * cos(position.y * 2.5 + uTime * 0.9);
  float dist = length(position.xy - uMouse * 1.5);
  float mouseEffect = smoothstep(2.0, 0.0, dist) * uHover * 0.2;
  float displacement = wave * 0.08 + mouseEffect + clamp(abs(uVelocity) * 0.015, 0.0, 0.2);
  vDisplacement = displacement;
  vec3 newPosition = position + normal * displacement;
  vNormal = normalize(normalMatrix * normal);
  vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
  vWorldPosition = (modelMatrix * vec4(newPosition, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`;

const fallbackFrag = `
precision highp float;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;
varying vec2 vUv;
varying float vDisplacement;
uniform float uTime;
uniform vec2 uMouse;
uniform float uVelocity;
uniform float uHover;

void main() {
  vec3 N = normalize(vWorldNormal);
  vec3 V = normalize(cameraPosition - vWorldPosition);
  float NdotV = max(dot(N, V), 0.0);
  float fresnel = pow(1.0 - NdotV, 3.0);
  vec3 keyLight = normalize(vec3(1.5, 2.0, 1.8));
  vec3 R = reflect(-V, N);
  float spec = pow(max(dot(R, keyLight), 0.0), 32.0);
  vec3 iridescentLilac = vec3(0.78, 0.71, 1.0);
  vec3 iridescentPink = vec3(1.0, 0.52, 0.63);
  vec3 voltOrange = vec3(1.0, 0.33, 0.0);
  float colorFactor = clamp(dot(R, vec3(0.0, 1.0, 0.0)) * 0.5 + 0.5 + vDisplacement * 1.5, 0.0, 1.0);
  vec3 color = mix(iridescentLilac, iridescentPink, colorFactor);
  color = mix(color, voltOrange, fresnel * 0.45);
  vec3 finalColor = vec3(0.04) + color * (fresnel * 0.85 + 0.15) + vec3(spec * 1.4);
  gl_FragColor = vec4(finalColor, 1.0);
}
`;

const INITIAL_HERO_UNIFORMS = {
  uTime: { value: 0 },
  uMouse: { value: new THREE.Vector2(0, 0) },
  uVelocity: { value: 0 },
  uHover: { value: 0 },
};

export default function HeroMetallicMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const setCursorVariant = useAppStore((s) => s.setCursorVariant);
  const setCursorLabel = useAppStore((s) => s.setCursorLabel);
  const prefersReducedMotion = useAppStore((s) => s.prefersReducedMotion);
  const gpuTier = useAppStore((s) => s.gpuTier);

  const [isHovered, setIsHovered] = useState(false);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0.25, y: 0 });
  const targetRotation = useRef({ x: 0.25, y: 0 });
  const autoRotateSpeed = useRef(0.35);

  // Load the optimized GLB sculpture
  const gltf = useGLTF("/models/hero-inflated-torus.glb");
  const customGeometry = useMemo(() => {
    let found: THREE.BufferGeometry | null = null;
    if (gltf?.scene) {
      gltf.scene.traverse((child) => {
        if (!found && (child as THREE.Mesh).isMesh) {
          const geom = (child as THREE.Mesh).geometry.clone();
          geom.center();
          geom.computeVertexNormals();
          found = geom;
        }
      });
    }
    return found;
  }, [gltf]);

  // Pointer drag interactions
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const deltaX = e.clientX - dragStart.current.x;
      const deltaY = e.clientY - dragStart.current.y;
      targetRotation.current.y = currentRotation.current.y + deltaX * 0.009;
      targetRotation.current.x = currentRotation.current.x + deltaY * 0.009;
    };

    const handlePointerUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        currentRotation.current.x = targetRotation.current.x;
        currentRotation.current.y = targetRotation.current.y;
        setCursorVariant("hover");
        setCursorLabel("DRAG");
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [setCursorVariant, setCursorLabel]);

  useFrame((state, delta) => {
    const mat = materialRef.current;
    if (!mat) return;
    const u = mat.uniforms;

    // Cap delta when browser tab is inactive/restored to prevent massive delta spike & crazy spinning
    const safeDelta = Math.min(delta, 0.064);

    if (prefersReducedMotion) {
      u.uHover.value = 0;
      u.uVelocity.value = 0;
      if (meshRef.current) {
        meshRef.current.rotation.x = 0.25;
        meshRef.current.position.y = 0;
      }
      return;
    }

    // Time update with safe delta
    u.uTime.value += safeDelta;

    // Lerp hover & mouse
    const targetHover = isHovered ? 1.0 : 0.0;
    u.uHover.value = THREE.MathUtils.lerp(
      u.uHover.value,
      targetHover,
      Math.min(safeDelta * 6, 1)
    );

    u.uMouse.value.lerp(state.pointer, Math.min(safeDelta * 5, 1));

    // Read scroll velocity from store with 0.92 damping
    const storeVelocity = useAppStore.getState().scrollVelocity;
    u.uVelocity.value = THREE.MathUtils.lerp(
      u.uVelocity.value,
      storeVelocity,
      0.08
    );

    // Mesh Rotation with Spring Inertia
    if (meshRef.current) {
      if (isDragging.current) {
        // Direct follow during drag
        meshRef.current.rotation.x = THREE.MathUtils.lerp(
          meshRef.current.rotation.x,
          targetRotation.current.x,
          Math.min(safeDelta * 14, 1)
        );
        meshRef.current.rotation.y = THREE.MathUtils.lerp(
          meshRef.current.rotation.y,
          targetRotation.current.y,
          Math.min(safeDelta * 14, 1)
        );
      } else {
        // Continuous organic idle spin + return to upright orientation
        targetRotation.current.y += safeDelta * autoRotateSpeed.current;
        currentRotation.current.y = targetRotation.current.y;

        // Spring return towards resting tilt (0.25 rad)
        targetRotation.current.x = THREE.MathUtils.lerp(
          targetRotation.current.x,
          0.25,
          Math.min(safeDelta * 1.5, 1)
        );
        currentRotation.current.x = targetRotation.current.x;

        meshRef.current.rotation.y = targetRotation.current.y;
        meshRef.current.rotation.x = THREE.MathUtils.lerp(
          meshRef.current.rotation.x,
          targetRotation.current.x,
          Math.min(safeDelta * 8, 1)
        );
      }

      // Subtle breathing float on Z
      meshRef.current.position.y = Math.sin(u.uTime.value * 1.2) * 0.08;
    }
  });

  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    isDragging.current = true;
    dragStart.current = {
      x: e.nativeEvent.clientX,
      y: e.nativeEvent.clientY,
    };
    currentRotation.current = {
      x: meshRef.current?.rotation.x ?? 0.25,
      y: meshRef.current?.rotation.y ?? 0,
    };
    setCursorVariant("drag");
    setCursorLabel("ROTATE");
  };

  const onPointerEnter = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setIsHovered(true);
    if (!isDragging.current) {
      setCursorVariant("hover");
      setCursorLabel("DRAG");
    }
  };

  const onPointerLeave = () => {
    setIsHovered(false);
    if (!isDragging.current) {
      setCursorVariant("default");
      setCursorLabel("");
    }
  };

  const effectiveVert = typeof vertexShader === "string" && vertexShader.length > 20 ? vertexShader : fallbackVert;
  const effectiveFrag = typeof fragmentShader === "string" && fragmentShader.length > 20 ? fragmentShader : fallbackFrag;

  return (
    <group>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1.8} />
      <directionalLight position={[-5, -4, -3]} intensity={0.8} color="#C8B6FF" />
      <pointLight position={[0, -2, 2]} intensity={1.2} color="#FF5500" />

      <mesh
        ref={meshRef}
        scale={0.58}
        onPointerDown={onPointerDown}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
      >
        {customGeometry ? (
          <primitive object={customGeometry} attach="geometry" />
        ) : (
          <torusKnotGeometry
            args={
              gpuTier === 1
                ? [1.15, 0.44, 64, 20, 2, 3]
                : [1.15, 0.44, 160, 40, 2, 3]
            }
          />
        )}

        <shaderMaterial
          ref={materialRef}
          vertexShader={effectiveVert}
          fragmentShader={effectiveFrag}
          uniforms={INITIAL_HERO_UNIFORMS}
          transparent={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

useGLTF.preload("/models/hero-inflated-torus.glb");
