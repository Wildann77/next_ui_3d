"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { View, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { useAppStore, type HoveredProject } from "@/store/useAppStore";
import vertexShader from "./shaders/rgbWaveHover.vert.glsl";
import fragmentShader from "./shaders/rgbWaveHover.frag.glsl";

// Fallback shaders for bundler safety
const fallbackVert = `
varying vec2 vUv;
varying vec3 vPosition;
varying float vWave;
uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uMouseVelocity;
uniform float uHover;

void main() {
  vUv = uv;
  vec3 pos = position;
  vec2 mouseUv = uMouse * 0.5 + 0.5;
  float dist = length(uv - mouseUv);
  float speed = length(uMouseVelocity);
  float wave = sin(dist * 18.0 - uTime * 4.0) * exp(-dist * 3.5) * speed;
  float organicWave = sin(pos.x * 3.5 + uTime * 1.5) * cos(pos.y * 3.5 + uTime * 1.2) * 0.03 * (uHover + speed);
  pos.z += (wave * 0.15 + organicWave);
  vWave = wave + organicWave;
  vPosition = pos;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const fallbackFrag = `
precision highp float;
varying vec2 vUv;
varying vec3 vPosition;
varying float vWave;
uniform sampler2D uTexture;
uniform sampler2D uPrevTexture;
uniform float uTransition;
uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uMouseVelocity;
uniform float uHover;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 uv = vUv;
  vec2 mouseUv = uMouse * 0.5 + 0.5;
  vec2 dir = uv - mouseUv;
  float dist = length(dir);
  vec2 normDir = dist > 0.0001 ? normalize(dir) : vec2(0.0);

  float velSpeed = length(uMouseVelocity);
  float clampedSpeed = clamp(velSpeed * 0.8, 0.0, 1.0);
  float waveDistort = sin(dist * 16.0 - uTime * 4.0) * exp(-dist * 3.0) * (clampedSpeed * 0.12 + 0.02 * uHover);
  vec2 distortedUv = uv + normDir * waveDistort;

  float dispersionBase = 0.018 * clampedSpeed + 0.003 * uHover;
  vec2 rOffset = normDir * dispersionBase + vec2(uMouseVelocity.x, -uMouseVelocity.y) * 0.015;
  vec2 bOffset = -(normDir * dispersionBase + vec2(uMouseVelocity.x, -uMouseVelocity.y) * 0.015);

  vec2 uvR = clamp(distortedUv + rOffset, 0.0, 1.0);
  vec2 uvG = clamp(distortedUv, 0.0, 1.0);
  vec2 uvB = clamp(distortedUv + bOffset, 0.0, 1.0);

  vec3 currentColor = vec3(texture2D(uTexture, uvR).r, texture2D(uTexture, uvG).g, texture2D(uTexture, uvB).b);
  vec3 prevColor = vec3(texture2D(uPrevTexture, uvR).r, texture2D(uPrevTexture, uvG).g, texture2D(uPrevTexture, uvB).b);
  vec3 blendedColor = mix(prevColor, currentColor, clamp(uTransition, 0.0, 1.0));

  float vignette = smoothstep(0.95, 0.45, length(uv - 0.5) * 1.35);
  blendedColor *= (0.78 + 0.22 * vignette);

  vec3 terracottaVolt = vec3(1.0, 0.33, 0.0);
  float edgeFringe = length(rOffset) * 12.0;
  blendedColor += terracottaVolt * clamp(edgeFringe * 0.3, 0.0, 0.45);

  float grain = (hash(uv * 240.0 + fract(uTime)) - 0.5) * 0.035;
  blendedColor += grain;

  float borderDistX = min(uv.x, 1.0 - uv.x);
  float borderDistY = min(uv.y, 1.0 - uv.y);
  if (min(borderDistX, borderDistY) < 0.007) {
    blendedColor = mix(blendedColor, vec3(0.95, 0.92, 0.88), 0.65);
  }

  gl_FragColor = vec4(blendedColor, clamp(uHover, 0.0, 1.0));
}
`;

// Creates a 2x2 solid fallback texture
function createFallbackTexture(colorHex = "#141416"): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 2;
  canvas.height = 2;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = colorHex;
    ctx.fillRect(0, 0, 2, 2);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

const INITIAL_DISTORTION_UNIFORMS = {
  uTexture: { value: null as THREE.Texture | null },
  uPrevTexture: { value: null as THREE.Texture | null },
  uTransition: { value: 1.0 },
  uTime: { value: 0 },
  uMouse: { value: new THREE.Vector2(0, 0) },
  uMouseVelocity: { value: new THREE.Vector2(0, 0) },
  uHover: { value: 0 },
};

export interface WorkDistortionPlaneProps {
  project?: HoveredProject | null;
}

export default function WorkDistortionPlane({ project }: WorkDistortionPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();

  const storeHoveredProject = useAppStore((s) => s.hoveredProject);
  const prefersReducedMotion = useAppStore((s) => s.prefersReducedMotion);
  const activeProject = project !== undefined ? project : storeHoveredProject;

  // Kinetic state refs
  const prevPointer = useRef(new THREE.Vector2(0, 0));
  const smoothVelocity = useRef(new THREE.Vector2(0, 0));
  const currentScale = useRef(0.001);
  const transitionProgress = useRef(1.0);

  // Cached textures dictionary
  const textureCache = useRef<Record<string, THREE.Texture>>({});
  const activeImageRef = useRef<string | null>(null);
  const fallbackTexture = useRef<THREE.CanvasTexture | null>(null);

  // Texture preloader
  useEffect(() => {
    if (!fallbackTexture.current) {
      fallbackTexture.current = createFallbackTexture("#0E0E0E");
    }
    const fallback = fallbackTexture.current;

    if (materialRef.current) {
      materialRef.current.uniforms.uTexture.value = fallback;
      materialRef.current.uniforms.uPrevTexture.value = fallback;
    }

    const loader = new THREE.TextureLoader();
    const defaultImages = [
      "/images/portfolio/utopia.webp",
      "/images/portfolio/aurbse.webp",
      "/images/portfolio/incognita.webp",
      "/images/portfolio/haptify.webp",
      "/images/portfolio/lgm.webp",
    ];

    defaultImages.forEach((url) => {
      loader.load(url, (tex) => {
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.generateMipmaps = false;
        tex.colorSpace = THREE.SRGBColorSpace;
        textureCache.current[url] = tex;

        // If this image is currently active, apply immediately
        if (activeImageRef.current === url && materialRef.current) {
          materialRef.current.uniforms.uTexture.value = tex;
          materialRef.current.needsUpdate = true;
        }
      });
    });

    const cache = textureCache.current;
    return () => {
      Object.values(cache).forEach((tex) => tex.dispose());
      fallback.dispose();
    };
  }, []);

  // Handle project change & smooth texture cross-fade
  useEffect(() => {
    if (!activeProject?.image || !materialRef.current) return;

    const nextImageUrl = activeProject.image;
    if (activeImageRef.current === nextImageUrl) return;

    const u = materialRef.current.uniforms;
    const cachedTex = textureCache.current[nextImageUrl];
    const prevTex = u.uTexture.value ?? fallbackTexture.current;

    u.uPrevTexture.value = prevTex;
    transitionProgress.current = 0.0;
    activeImageRef.current = nextImageUrl;

    if (cachedTex) {
      u.uTexture.value = cachedTex;
      materialRef.current.needsUpdate = true;
    } else {
      const loader = new THREE.TextureLoader();
      loader.load(nextImageUrl, (tex) => {
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.generateMipmaps = false;
        tex.colorSpace = THREE.SRGBColorSpace;
        textureCache.current[nextImageUrl] = tex;
        if (activeImageRef.current === nextImageUrl && materialRef.current) {
          materialRef.current.uniforms.uTexture.value = tex;
          materialRef.current.needsUpdate = true;
        }
      });
    }
  }, [activeProject]);

  // Main 60 FPS Render & Physics Loop
  useFrame((state, delta) => {
    const mat = materialRef.current;
    const mesh = meshRef.current;
    if (!mat || !mesh) return;
    const u = mat.uniforms;

    const safeDelta = Math.min(delta, 0.064);

    // Time ticker
    u.uTime.value += safeDelta;

    // Calculate mouse velocity from frame pointer delta
    const currentPointerX = state.pointer.x;
    const currentPointerY = state.pointer.y;
    const dt = Math.max(safeDelta, 0.001);
    const instantVx = (currentPointerX - prevPointer.current.x) / dt;
    const instantVy = (currentPointerY - prevPointer.current.y) / dt;
    prevPointer.current.set(currentPointerX, currentPointerY);

    // Smooth velocity with inertia damping (disabled under reduced motion)
    if (prefersReducedMotion) {
      smoothVelocity.current.set(0, 0);
    } else {
      smoothVelocity.current.x = THREE.MathUtils.lerp(
        smoothVelocity.current.x,
        instantVx,
        Math.min(safeDelta * 10, 1)
      );
      smoothVelocity.current.y = THREE.MathUtils.lerp(
        smoothVelocity.current.y,
        instantVy,
        Math.min(safeDelta * 10, 1)
      );
    }
    u.uMouseVelocity.value.copy(smoothVelocity.current);

    // Smooth pointer UV mapping
    u.uMouse.value.lerp(state.pointer, delta * 8);

    // Smooth hover progress (0.0 <-> 1.0)
    const targetHover = activeProject ? 1.0 : 0.0;
    u.uHover.value = THREE.MathUtils.lerp(
      u.uHover.value,
      targetHover,
      delta * 7
    );

    // Texture crossfade progression
    if (transitionProgress.current < 1.0) {
      transitionProgress.current = Math.min(1.0, transitionProgress.current + delta * 3.5);
      u.uTransition.value = transitionProgress.current;
    }

    // Unproject pointer coordinates to 3D world units at z = 0
    const targetX = (state.pointer.x * viewport.width) / 2;
    const targetY = (state.pointer.y * viewport.height) / 2;

    // Smooth position gliding towards cursor
    mesh.position.x = THREE.MathUtils.lerp(
      mesh.position.x,
      targetX,
      delta * 9
    );
    mesh.position.y = THREE.MathUtils.lerp(
      mesh.position.y,
      targetY,
      delta * 9
    );

    // Dynamic physical tilt from velocity
    const targetRotZ = -THREE.MathUtils.clamp(smoothVelocity.current.x * 0.035, -0.22, 0.22);
    const targetRotX = THREE.MathUtils.clamp(smoothVelocity.current.y * 0.035, -0.22, 0.22);
    mesh.rotation.z = THREE.MathUtils.lerp(mesh.rotation.z, targetRotZ, delta * 10);
    mesh.rotation.x = THREE.MathUtils.lerp(mesh.rotation.x, targetRotX, delta * 10);

    // Organic scale spring
    const targetScale = activeProject ? 1.0 : 0.001;
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale, delta * 8);

    // Aspect ratio 3:2 (1.8w x 1.2h)
    mesh.scale.set(
      1.8 * currentScale.current,
      1.2 * currentScale.current,
      1.0
    );

    mesh.visible = currentScale.current > 0.01;
  });

  const effectiveVert =
    typeof vertexShader === "string" && vertexShader.length > 20
      ? vertexShader
      : fallbackVert;
  const effectiveFrag =
    typeof fragmentShader === "string" && fragmentShader.length > 20
      ? fragmentShader
      : fallbackFrag;

  return (
    <group>
      <mesh ref={meshRef} position={[0, 0, 0]} visible={false}>
        {/* Exact 32x32 segmented plane for GPU wave deformation */}
        <planeGeometry args={[1, 1, 32, 32]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={effectiveVert}
          fragmentShader={effectiveFrag}
          uniforms={INITIAL_DISTORTION_UNIFORMS}
          transparent={true}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/**
 * Self-contained View tunnel wrapper for WorkDistortionPlane.
 * Can be mounted directly into DOM page or portfolio showcase section.
 */
export function WorkDistortionView({
  className = "fixed inset-0 pointer-events-none z-20 overflow-hidden",
  project,
}: {
  className?: string;
  project?: HoveredProject | null;
}) {
  return (
    <View className={className}>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />
      <WorkDistortionPlane project={project} />
    </View>
  );
}
