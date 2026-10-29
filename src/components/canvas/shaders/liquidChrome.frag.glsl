// liquidChrome.frag.glsl
precision highp float;

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
  vec3 N = normalize(vWorldNormal);
  vec3 V = normalize(cameraPosition - vWorldPosition);

  // Fresnel grazing angle
  float NdotV = max(dot(N, V), 0.0);
  float fresnel = pow(1.0 - NdotV, 3.2);

  // Dynamic light directions (Studio setup)
  vec3 keyLight = normalize(vec3(1.5, 2.0, 1.8));
  vec3 rimLight = normalize(vec3(-2.0, -1.0, -1.5));
  vec3 fillLight = normalize(vec3(0.0, -2.5, 1.0));

  // Reflection vector
  vec3 R = reflect(-V, N);

  // Chromatic dispersion offsets based on velocity & mouse
  float dispersion = 0.04 + clamp(abs(uVelocity) * 0.008, 0.0, 0.08) + uHover * 0.02;

  // Multi-band color sampling simulating spectral refraction
  float specR = pow(max(dot(reflect(-V, normalize(N + vec3(dispersion, 0.0, 0.0))), keyLight), 0.0), 32.0);
  float specG = pow(max(dot(reflect(-V, N), keyLight), 0.0), 32.0);
  float specB = pow(max(dot(reflect(-V, normalize(N - vec3(dispersion, 0.0, 0.0))), keyLight), 0.0), 32.0);

  // Base Obsidian Chrome Liquid
  vec3 obsidianBase = vec3(0.04, 0.04, 0.05);

  // Iridescent shift colors (OKLCH mapped: #C8B6FF -> #FF85A1 with #FF5500 hints)
  vec3 iridescentLilac = vec3(0.78, 0.71, 1.0);
  vec3 iridescentPink  = vec3(1.0, 0.52, 0.63);
  vec3 voltOrange      = vec3(1.0, 0.33, 0.0);

  // Color gradient driven by surface orientation & displacement
  float colorFactor = clamp(dot(R, vec3(0.0, 1.0, 0.0)) * 0.5 + 0.5 + vDisplacement * 1.5, 0.0, 1.0);
  vec3 iridescentColor = mix(iridescentLilac, iridescentPink, colorFactor);
  iridescentColor = mix(iridescentColor, voltOrange, fresnel * 0.45);

  // Studio rim reflections
  float rim = pow(1.0 - NdotV, 4.0);
  vec3 rimColor = mix(vec3(0.9, 0.95, 1.0), voltOrange, clamp(abs(uVelocity) * 0.03, 0.0, 1.0));

  // Combine layers
  vec3 finalColor = obsidianBase;
  finalColor += iridescentColor * (fresnel * 0.85 + 0.15);
  finalColor += vec3(specR, specG, specB) * 1.4;
  finalColor += rim * rimColor * 0.9;

  // Add subtle film grain / noise highlight
  float microGleam = fract(sin(dot(vUv * 100.0 + vec2(uTime * 0.1), vec2(12.9898, 78.233))) * 43758.5453);
  finalColor += microGleam * 0.02;

  gl_FragColor = vec4(finalColor, 1.0);
}
