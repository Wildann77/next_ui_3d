// rgbWaveHover.vert.glsl
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

  // Normalized distance from vertex UV to pointer UV
  vec2 mouseUv = uMouse * 0.5 + 0.5;
  float dist = length(uv - mouseUv);
  
  // Wave ripple based on mouse velocity and distance
  float speed = length(uMouseVelocity);
  float wave = sin(dist * 18.0 - uTime * 4.0) * exp(-dist * 3.5) * speed;
  
  // Fluid subtle organic wave across grid
  float organicWave = sin(pos.x * 3.5 + uTime * 1.5) * cos(pos.y * 3.5 + uTime * 1.2) * 0.03 * (uHover + speed);
  
  pos.z += (wave * 0.15 + organicWave);
  vWave = wave + organicWave;
  vPosition = pos;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
