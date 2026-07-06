import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// ─── SOFT NEBULA GLOW SPRITE TEXTURE ──────────────────────────────────────────
function createGlowTexture() {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const half = size / 2;
  const grad = ctx.createRadialGradient(half, half, 0, half, half, half);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.2, 'rgba(255, 255, 255, 0.6)');
  grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.15)');
  grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

// ─── GPU DRIFT SHADER MATERIAL ────────────────────────────────────────────────
const NebulaShaderMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uTexture: { value: null }
  },
  vertexShader: `
    uniform float uTime;
    attribute vec3 aVelocity;
    varying vec3 vColor;
    void main() {
      vColor = color;
      
      // Calculate dynamic drift on GPU using sine wave offsets
      vec3 waveOffset = sin(uTime * 0.35 + position) * aVelocity * 0.8;
      vec3 finalPos = position + waveOffset;
      
      vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      
      // Dynamic size attenuation
      gl_PointSize = (45.0 / -mvPosition.z);
    }
  `,
  fragmentShader: `
    uniform sampler2D uTexture;
    varying vec3 vColor;
    void main() {
      vec4 tex = texture2D(uTexture, gl_PointCoord);
      if (tex.a < 0.01) discard;
      gl_FragColor = vec4(vColor, tex.a * 0.4);
    }
  `
};

export default function CelestialBodies({ scrollProgress, activeSection, mousePos, reducedMotion }) {
  const groupRef = useRef();
  const starfieldRef = useRef();
  const nebulaMaterialRef = useRef();
  const blackHoleTorusRef = useRef();
  const quasarBeamRef = useRef();
  const pulsarHaloRef = useRef();
  
  // Refs for internship orbital points
  const orbPoint1 = useRef();
  const orbPoint2 = useRef();
  const orbPoint3 = useRef();

  const glowTex = useMemo(() => createGlowTexture(), []);

  // ─── 3D SCENE COORDINATES MAP (CLUSTERED ALONG Z AXIS) ───────────────────────
  const COORDS = {
    blackHole: [0, 0, 0],
    orbits: [-6, -0.5, -8],
    nebula: [7, -1, -16],
    quasar: [-5, 3, -23],
    pulsar: [6, 1.5, -30]
  };

  // ─── CAMERA FLIGHT PATH TIMELINE TARGETS ─────────────────────────────────────
  const sectionTargets = useMemo(() => [
    { camPos: [0, 1.2, 5.2], lookAt: [0, 0, 0] },          // Hero: Accretion Disk
    { camPos: [-5.5, 0.8, -5], lookAt: [-6, -0.5, -8] },  // Internships: Orbital System
    { camPos: [4, -0.5, -13], lookAt: [7, -1, -16] },      // Projects: Nebula Lanes
    { camPos: [-5, 6, -21], lookAt: [-5, 3, -23] },        // Skills: Quasar Beam
    { camPos: [4, 2, -27], lookAt: [6, 1.5, -30] },        // Certifications: Pulsar Glow
    { camPos: [0, 12, -15], lookAt: [0, 0, -15] }          // Contact: Full Starfield
  ], []);

  // ─── 1. GLOBAL BACKGROUND STARFIELD (12,000 particles) ──────────────────────
  const starfield = useMemo(() => {
    const count = 12000;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 70 + Math.random() * 50;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  // ─── 2. VOLUMETRIC COSMIC GAS LANES (25,000 particles - GPU DRIVEN) ──────────
  const nebulaData = useMemo(() => {
    const count = 25000;
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const vels = new Float32Array(count * 3);

    const cyan = new THREE.Color("#00d4ff");
    const purple = new THREE.Color("#7c3aed");
    const magenta = new THREE.Color("#a855f7");

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const z = -(i / count) * 45; // corridor range
      const angle = (z * 0.15) + (Math.random() - 0.5) * 1.5;
      const r = 2.0 + Math.pow(Math.random(), 1.5) * 4.0;

      pos[idx] = Math.cos(angle) * r;
      pos[idx + 1] = Math.sin(angle) * r + (Math.random() - 0.5) * 1.8;
      pos[idx + 2] = z;

      // Color shifts along corridor
      let colorMix;
      if (z > -10) colorMix = cyan;
      else if (z > -25) colorMix = purple;
      else colorMix = magenta;

      // Inner dense lane hotter white/cyan gradient
      const hotWhite = new THREE.Color("#f8fafc");
      const c = r < 2.2 && Math.random() > 0.7 ? hotWhite : colorMix;

      cols[idx] = c.r;
      cols[idx + 1] = c.g;
      cols[idx + 2] = c.b;

      // GPU velocity attributes (amplitude of wave drift)
      vels[idx] = (Math.random() - 0.5) * 0.15;
      vels[idx + 1] = (Math.random() - 0.5) * 0.15;
      vels[idx + 2] = (Math.random() - 0.5) * 0.15;
    }
    return { pos, cols, vels };
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uTexture: { value: glowTex }
  }), [glowTex]);

  // ─── FRAME UPDATE ────────────────────────────────────────────────────────────
  useFrame((state) => {
    // If prefers-reduced-motion is active, freeze the animation timer at 0
    const time = reducedMotion ? 0 : state.clock.getElapsedTime();
    const { camera } = state;

    // ── GPU uniform updates (freeze drift when reducedMotion is active) ──
    if (nebulaMaterialRef.current) {
      nebulaMaterialRef.current.uniforms.uTime.value = time;
    }

    // ── Camera scroll flight ──
    const progress = scrollProgress;
    const baseIdx = Math.min(Math.floor(progress), sectionTargets.length - 2);
    const alpha = progress - baseIdx;
    const tA = sectionTargets[baseIdx];
    const tB = sectionTargets[baseIdx + 1];

    if (tA && tB) {
      const tx = THREE.MathUtils.lerp(tA.camPos[0], tB.camPos[0], alpha);
      const ty = THREE.MathUtils.lerp(tA.camPos[1], tB.camPos[1], alpha);
      const tz = THREE.MathUtils.lerp(tA.camPos[2], tB.camPos[2], alpha);
      const lx = THREE.MathUtils.lerp(tA.lookAt[0], tB.lookAt[0], alpha);
      const ly = THREE.MathUtils.lerp(tA.lookAt[1], tB.lookAt[1], alpha);
      const lz = THREE.MathUtils.lerp(tA.lookAt[2], tB.lookAt[2], alpha);

      // In reduced motion, we directly position the camera with no lerp smoothing/delay
      if (reducedMotion) {
        camera.position.set(tx, ty, tz);
        camera.lookAt(new THREE.Vector3(lx, ly, lz));
      } else {
        camera.position.set(
          THREE.MathUtils.lerp(camera.position.x, tx, 0.08),
          THREE.MathUtils.lerp(camera.position.y, ty, 0.08),
          THREE.MathUtils.lerp(camera.position.z, tz, 0.08)
        );
        camera.lookAt(new THREE.Vector3(lx, ly, lz));
      }
    }

    // Mouse Parallax (only if motion is enabled)
    if (!reducedMotion) {
      camera.position.x += mousePos.x * 0.12;
      camera.position.y += mousePos.y * 0.12;
    }

    // ── FOCAL FEATURE 1: Hero Accretion Torus rotation ──
    if (blackHoleTorusRef.current) {
      blackHoleTorusRef.current.rotation.z = time * 0.1;
    }

    // ── FOCAL FEATURE 2: Internships orbiting points (3 distinct bodies) ──
    if (orbPoint1.current) {
      const angle = time * 1.2;
      orbPoint1.current.position.set(
        Math.cos(angle) * 1.5,
        Math.sin(angle) * 0.2,
        Math.sin(angle) * 1.5
      );
    }
    if (orbPoint2.current) {
      const angle = time * 0.8 + 2.0;
      orbPoint2.current.position.set(
        Math.cos(angle) * 2.4,
        Math.sin(angle) * -0.1,
        Math.sin(angle) * 2.4
      );
    }
    if (orbPoint3.current) {
      const angle = time * 0.5 + 4.0;
      orbPoint3.current.position.set(
        Math.cos(angle) * 3.2,
        Math.sin(angle) * 0.3,
        Math.sin(angle) * 3.2
      );
    }

    // ── FOCAL FEATURE 4: Skills Quasar beam pulse on hover/active ──
    if (quasarBeamRef.current) {
      const activeFactor = activeSection === 3 ? 1.0 : 0.2;
      const intensity = (0.25 + Math.sin(time * 12) * 0.05) * activeFactor;
      quasarBeamRef.current.material.opacity = intensity;
    }

    // ── FOCAL FEATURE 5: Certifications Pulsar slow opacity pulse ──
    if (pulsarHaloRef.current) {
      const pulse = 0.15 + Math.sin(time * 3) * 0.08;
      pulsarHaloRef.current.material.opacity = pulse;
    }

    // ── Slow global universe rotations ──
    if (groupRef.current && !reducedMotion) {
      groupRef.current.rotation.z = time * 0.003;
    }
  });

  return (
    <group ref={groupRef}>
      {/* ══════ GLOBAL BACKGROUND STARFIELD ══════ */}
      <Points ref={starfieldRef} positions={starfield} stride={3}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.08}
          sizeAttenuation={true}
          depthWrite={false}
          map={glowTex}
        />
      </Points>

      {/* ══════ GPU-ANIMATED NEBULA DUST CORRIDOR ══════ */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[nebulaData.pos, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[nebulaData.cols, 3]}
          />
          <bufferAttribute
            attach="attributes-aVelocity"
            args={[nebulaData.vels, 3]}
          />
        </bufferGeometry>
        <shaderMaterial
          ref={nebulaMaterialRef}
          args={[NebulaShaderMaterial]}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* ========================================================
          FOCAL FEATURE 1: Hero Black Hole Torus Accretion Glow
          ======================================================== */}
      <group position={COORDS.blackHole}>
        <mesh ref={blackHoleTorusRef} rotation={[Math.PI / 2, 0.1, 0]}>
          <torusGeometry args={[1.6, 0.12, 8, 64]} />
          <meshBasicMaterial 
            color="#fbbf24" 
            transparent 
            opacity={0.25} 
            blending={THREE.AdditiveBlending} 
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.9, 32, 32]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
      </group>

      {/* ========================================================
          FOCAL FEATURE 2: Internships Orbital Rings & Points
          ======================================================== */}
      <group position={COORDS.orbits}>
        {/* Central star */}
        <mesh>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={3} />
        </mesh>

        {/* Orbit paths - thin astronomical line rings */}
        <mesh rotation={[Math.PI / 2, 0.2, 0]}>
          <ringGeometry args={[1.5, 1.515, 64]} />
          <meshBasicMaterial color="#00d4ff" transparent opacity={0.25} side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[Math.PI / 2, -0.1, 0]}>
          <ringGeometry args={[2.4, 2.415, 64]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.15} side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0.35, 0]}>
          <ringGeometry args={[3.2, 3.215, 64]} />
          <meshBasicMaterial color="#00d4ff" transparent opacity={0.1} side={THREE.DoubleSide} />
        </mesh>

        {/* Orbiting Bodies (small points) */}
        <mesh ref={orbPoint1}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh ref={orbPoint2}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color="#00d4ff" />
        </mesh>
        <mesh ref={orbPoint3}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* ========================================================
          FOCAL FEATURE 4: Skills Quasar Thin Vertical Glow Beam
          ======================================================== */}
      <group position={COORDS.quasar}>
        <mesh>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={4} />
        </mesh>
        {/* Stretched vertical additive glow cylinder */}
        <mesh ref={quasarBeamRef}>
          <cylinderGeometry args={[0.02, 0.08, 8, 16, 1, true]} />
          <meshBasicMaterial 
            color="#00d4ff" 
            transparent 
            opacity={0.3} 
            blending={THREE.AdditiveBlending} 
          />
        </mesh>
      </group>

      {/* ========================================================
          FOCAL FEATURE 5: Certifications Pulsar Slow Opacity Pulsar
          ======================================================== */}
      <group position={COORDS.pulsar}>
        <mesh>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={3} />
        </mesh>
        {/* Pulsing halo */}
        <mesh ref={pulsarHaloRef}>
          <sphereGeometry args={[1.5, 24, 24]} />
          <meshBasicMaterial 
            color="#fbbf24" 
            transparent 
            opacity={0.15} 
            blending={THREE.AdditiveBlending} 
            side={THREE.BackSide}
          />
        </mesh>
      </group>
    </group>
  );
}
