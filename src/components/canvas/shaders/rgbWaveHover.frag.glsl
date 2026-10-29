// rgbWaveHover.frag.glsl
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

// Micro noise generator for analog grain
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 uv = vUv;
  
  // Center coordinates relative to mouse in UV space
  vec2 mouseUv = uMouse * 0.5 + 0.5;
  vec2 dir = uv - mouseUv;
  float dist = length(dir);
  vec2 normDir = dist > 0.0001 ? normalize(dir) : vec2(0.0);

  // Velocity intensity calculation
  float velSpeed = length(uMouseVelocity);
  float clampedSpeed = clamp(velSpeed * 0.8, 0.0, 1.0);

  // Liquid curvature distortion displacement
  float waveDistort = sin(dist * 16.0 - uTime * 4.0) * exp(-dist * 3.0) * (clampedSpeed * 0.12 + 0.02 * uHover);
  vec2 distortedUv = uv + normDir * waveDistort;

  // RGB channel separation (Chromatic Aberration) offsets based on velocity direction & displacement
  float dispersionBase = 0.018 * clampedSpeed + 0.003 * uHover;
  vec2 rOffset = normDir * dispersionBase + vec2(uMouseVelocity.x, -uMouseVelocity.y) * 0.015;
  vec2 bOffset = -(normDir * dispersionBase + vec2(uMouseVelocity.x, -uMouseVelocity.y) * 0.015);

  vec2 uvR = clamp(distortedUv + rOffset, 0.0, 1.0);
  vec2 uvG = clamp(distortedUv, 0.0, 1.0);
  vec2 uvB = clamp(distortedUv + bOffset, 0.0, 1.0);

  // Sample current texture channels
  float currentR = texture2D(uTexture, uvR).r;
  float currentG = texture2D(uTexture, uvG).g;
  float currentB = texture2D(uTexture, uvB).b;
  vec3 currentColor = vec3(currentR, currentG, currentB);

  // Sample previous texture channels (for smooth cross-fade transition)
  float prevR = texture2D(uPrevTexture, uvR).r;
  float prevG = texture2D(uPrevTexture, uvG).g;
  float prevB = texture2D(uPrevTexture, uvB).b;
  vec3 prevColor = vec3(prevR, prevG, prevB);

  // Cross-fade between projects
  vec3 blendedColor = mix(prevColor, currentColor, clamp(uTransition, 0.0, 1.0));

  // High-contrast brutalist edge grading + obsidian vignette
  float vignette = smoothstep(0.95, 0.45, length(uv - 0.5) * 1.35);
  blendedColor *= (0.78 + 0.22 * vignette);

  // Terracotta Volt subtle chromatic rim flare on fast movements
  vec3 terracottaVolt = vec3(1.0, 0.33, 0.0);
  float edgeFringe = length(rOffset) * 12.0;
  blendedColor += terracottaVolt * clamp(edgeFringe * 0.3, 0.0, 0.45);

  // Micro analog film grain
  float grain = (hash(uv * 240.0 + fract(uTime)) - 0.5) * 0.035;
  blendedColor += grain;

  // Hairline brutalist border
  float borderDistX = min(uv.x, 1.0 - uv.x);
  float borderDistY = min(uv.y, 1.0 - uv.y);
  float minBorder = min(borderDistX, borderDistY);
  if (minBorder < 0.007) {
    blendedColor = mix(blendedColor, vec3(0.95, 0.92, 0.88), 0.65);
  }

  // Alpha fade governed by uHover
  float alpha = clamp(uHover, 0.0, 1.0);

  gl_FragColor = vec4(blendedColor, alpha);
}
