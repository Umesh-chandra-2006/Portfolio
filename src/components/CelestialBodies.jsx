import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// ─── GLOW SPRITE TEXTURE ───────────────────────────────────────────────────────
function createGlowTexture() {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const half = size / 2;
  const grad = ctx.createRadialGradient(half, half, 0, half, half, half);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.15, 'rgba(255,255,255,0.7)');
  grad.addColorStop(0.4, 'rgba(255,255,255,0.15)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

export default function CelestialBodies({ scrollProgress, mousePos }) {
  // Refs for animated particle systems
  const blackHoleDiskRef = useRef();
  const orbitRingsRef = useRef();
  const nebulaRef = useRef();
  const quasarRef = useRef();
  const pulsarRef = useRef();
  const dustRef = useRef();
  const pulsarMeshRef = useRef();
  const blackHoleCoronaRef = useRef();

  const glowTex = useMemo(() => createGlowTexture(), []);

  // ─── COMPRESSED 3D COORDINATES (objects CLOSE together) ──────────────────────
  const COORDS = {
    blackHole: [0, 0, 0],
    orbits: [-6, -0.5, -8],
    nebula: [7, -1, -16],
    quasar: [-5, 3, -23],
    pulsar: [6, 1.5, -30]
  };

  // ─── CAMERA TOUR: objects are now close → camera stays immersed ──────────────
  const sectionTargets = useMemo(() => [
    { camPos: [0, 1.2, 5], lookAt: [0, 0, 0] },          // Hero: face the black hole
    { camPos: [-5.5, 0.8, -5], lookAt: [-6, -0.5, -8] },  // Internships: orbit system
    { camPos: [4, -0.5, -13], lookAt: [7, -1, -16] },      // Projects: inside nebula
    { camPos: [-5, 6, -21], lookAt: [-5, 3, -23] },        // Skills: above quasar
    { camPos: [4, 2, -27], lookAt: [6, 1.5, -30] },        // Certs: pulsing pulsar
    { camPos: [0, 12, -15], lookAt: [0, 0, -15] }          // Contact: zoomed-out overview
  ], []);

  // ─── 1. BACKGROUND STARFIELD ─────────────────────────────────────────────────
  const starfield = useMemo(() => {
    const count = 8000;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 60 + Math.random() * 40;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  // ─── 2. COSMIC DUST (scattered along camera path for atmosphere) ─────────────
  const cosmicDust = useMemo(() => {
    const count = 3000;
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const cyan = new THREE.Color("#00d4ff");
    const purple = new THREE.Color("#7c3aed");

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      // Scatter along the Z corridor the camera flies through
      pos[idx] = (Math.random() - 0.5) * 20;
      pos[idx + 1] = (Math.random() - 0.5) * 8;
      pos[idx + 2] = Math.random() * -35;

      const c = Math.random() > 0.5 ? cyan : purple;
      cols[idx] = c.r * 0.3;
      cols[idx + 1] = c.g * 0.3;
      cols[idx + 2] = c.b * 0.3;
    }
    return { pos, cols };
  }, []);

  // ─── 3. BLACK HOLE ACCRETION DISK (10,000 particles — DENSE) ─────────────────
  const blackHoleDisk = useMemo(() => {
    const count = 10000;
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const gold = new THREE.Color("#fbbf24");
    const amber = new THREE.Color("#f59e0b");
    const magenta = new THREE.Color("#a855f7");
    const white = new THREE.Color("#fff7ed");

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.2 + Math.pow(Math.random(), 1.5) * 3.5;

      pos[idx] = Math.cos(angle) * radius;
      pos[idx + 1] = (Math.random() - 0.5) * (0.05 + radius * 0.02);
      pos[idx + 2] = Math.sin(angle) * radius;

      // Inner ring hot white/gold, outer ring magenta
      let c;
      if (radius < 2.0) c = white;
      else if (radius < 3.0) c = gold;
      else if (radius < 4.0) c = amber;
      else c = magenta;

      cols[idx] = c.r;
      cols[idx + 1] = c.g;
      cols[idx + 2] = c.b;
    }
    return { pos, cols };
  }, []);

  // ─── 4. ORBITING SYSTEM (5,000 particles in 3 tilted rings) ──────────────────
  const orbitRings = useMemo(() => {
    const count = 5000;
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const cyan = new THREE.Color("#00d4ff");
    const white = new THREE.Color("#e2e8f0");

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const ring = i % 3;
      const radius = 1.5 + ring * 1.0;
      const angle = Math.random() * Math.PI * 2;
      const tilt = ring * 0.3; // Each ring tilted differently

      pos[idx] = COORDS.orbits[0] + Math.cos(angle) * radius;
      pos[idx + 1] = COORDS.orbits[1] + Math.sin(angle) * Math.sin(tilt) * radius * 0.3;
      pos[idx + 2] = COORDS.orbits[2] + Math.sin(angle) * radius;

      const c = ring === 0 ? cyan : white;
      cols[idx] = c.r;
      cols[idx + 1] = c.g;
      cols[idx + 2] = c.b;
    }
    return { pos, cols };
  }, []);

  // ─── 5. VOLUMETRIC NEBULA (6,000 LARGE particles) ────────────────────────────
  const nebula = useMemo(() => {
    const count = 6000;
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const vels = new Float32Array(count * 3);
    const purple = new THREE.Color("#7c3aed");
    const magenta = new THREE.Color("#a855f7");
    const cyan = new THREE.Color("#00d4ff");
    const pink = new THREE.Color("#ec4899");

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      // 3 overlapping dense clusters
      const cluster = i % 3;
      const cx = COORDS.nebula[0] + (cluster - 1) * 1.8;
      const cy = COORDS.nebula[1] + (cluster === 1 ? 0.5 : -0.3);
      const cz = COORDS.nebula[2] + (cluster - 1) * 0.8;

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.pow(Math.random(), 0.6) * 3.0;

      pos[idx] = cx + r * Math.sin(phi) * Math.cos(theta);
      pos[idx + 1] = cy + r * Math.sin(phi) * Math.sin(theta) * 0.7;
      pos[idx + 2] = cz + r * Math.cos(phi);

      const palette = [purple, magenta, cyan, pink];
      const c = palette[i % 4];
      cols[idx] = c.r;
      cols[idx + 1] = c.g;
      cols[idx + 2] = c.b;

      vels[idx] = (Math.random() - 0.5) * 0.008;
      vels[idx + 1] = (Math.random() - 0.5) * 0.008;
      vels[idx + 2] = (Math.random() - 0.5) * 0.008;
    }
    return { pos, cols, vels };
  }, []);

  // ─── 6. QUASAR: DISK + JETS (6,000 particles) ────────────────────────────────
  const quasar = useMemo(() => {
    const count = 6000;
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const cyan = new THREE.Color("#00d4ff");
    const white = new THREE.Color("#ffffff");
    const blue = new THREE.Color("#3b82f6");

    for (let i = 0; i < count; i++) {
      const idx = i * 3;

      if (i < 2500) {
        // Fast-spinning accretion ring
        const angle = Math.random() * Math.PI * 2;
        const radius = 0.6 + Math.random() * 2.5;
        pos[idx] = COORDS.quasar[0] + Math.cos(angle) * radius;
        pos[idx + 1] = COORDS.quasar[1] + (Math.random() - 0.5) * 0.06;
        pos[idx + 2] = COORDS.quasar[2] + Math.sin(angle) * radius;

        const c = Math.random() > 0.3 ? cyan : blue;
        cols[idx] = c.r;
        cols[idx + 1] = c.g;
        cols[idx + 2] = c.b;
      } else {
        // Vertical polar jets (both directions)
        const dir = i % 2 === 0 ? 1 : -1;
        const height = Math.random() * 8.0;
        const spread = 0.03 + height * 0.04;
        const angle = Math.random() * Math.PI * 2;

        pos[idx] = COORDS.quasar[0] + Math.cos(angle) * spread;
        pos[idx + 1] = COORDS.quasar[1] + height * dir;
        pos[idx + 2] = COORDS.quasar[2] + Math.sin(angle) * spread;

        // Jet fades from white at base to cyan at tip
        const mix = height / 8.0;
        cols[idx] = THREE.MathUtils.lerp(white.r, cyan.r, mix);
        cols[idx + 1] = THREE.MathUtils.lerp(white.g, cyan.g, mix);
        cols[idx + 2] = THREE.MathUtils.lerp(white.b, cyan.b, mix);
      }
    }
    return { pos, cols };
  }, []);

  // ─── 7. PULSAR: RINGS + CONCENTRIC WAVES (4,000 particles) ───────────────────
  const pulsar = useMemo(() => {
    const count = 4000;
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const gold = new THREE.Color("#fbbf24");
    const white = new THREE.Color("#fef3c7");

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const ring = i % 5;
      const baseRadius = 0.8 + ring * 0.7;
      const angle = Math.random() * Math.PI * 2;

      pos[idx] = COORDS.pulsar[0] + Math.cos(angle) * baseRadius;
      pos[idx + 1] = COORDS.pulsar[1] + (Math.random() - 0.5) * 0.08;
      pos[idx + 2] = COORDS.pulsar[2] + Math.sin(angle) * baseRadius;

      const c = ring % 2 === 0 ? gold : white;
      cols[idx] = c.r;
      cols[idx + 1] = c.g;
      cols[idx + 2] = c.b;
    }
    return { pos, cols };
  }, []);

  // ─── FRAME ANIMATION ─────────────────────────────────────────────────────────
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const { camera } = state;

    // ── Camera flight interpolation ──
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

      // Faster lerp = snappier response
      camera.position.set(
        THREE.MathUtils.lerp(camera.position.x, tx, 0.08),
        THREE.MathUtils.lerp(camera.position.y, ty, 0.08),
        THREE.MathUtils.lerp(camera.position.z, tz, 0.08)
      );
      camera.lookAt(new THREE.Vector3(lx, ly, lz));
    }

    // Mouse parallax
    camera.position.x += mousePos.x * 0.12;
    camera.position.y += mousePos.y * 0.12;

    // ── Black hole corona pulse ──
    if (blackHoleCoronaRef.current) {
      const s = 1.8 + Math.sin(time * 2) * 0.15;
      blackHoleCoronaRef.current.scale.set(s, s, s);
    }

    // ── Accretion disk orbital rotation ──
    if (blackHoleDiskRef.current) {
      const arr = blackHoleDiskRef.current.geometry.attributes.position.array;
      const count = arr.length / 3;
      for (let i = 0; i < count; i++) {
        const idx = i * 3;
        const x = arr[idx], z = arr[idx + 2];
        const r = Math.sqrt(x * x + z * z);
        const speed = 0.015 / Math.max(r, 0.3);
        const a = Math.atan2(z, x) + speed;
        arr[idx] = Math.cos(a) * r;
        arr[idx + 2] = Math.sin(a) * r;
      }
      blackHoleDiskRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // ── Orbit rings rotation ──
    if (orbitRingsRef.current) {
      const arr = orbitRingsRef.current.geometry.attributes.position.array;
      const count = arr.length / 3;
      for (let i = 0; i < count; i++) {
        const idx = i * 3;
        const ring = i % 3;
        const dx = arr[idx] - COORDS.orbits[0];
        const dz = arr[idx + 2] - COORDS.orbits[2];
        const r = Math.sqrt(dx * dx + dz * dz);
        const speed = 0.006 * (3 - ring);
        const a = Math.atan2(dz, dx) + speed;
        arr[idx] = COORDS.orbits[0] + Math.cos(a) * r;
        arr[idx + 2] = COORDS.orbits[2] + Math.sin(a) * r;
      }
      orbitRingsRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // ── Nebula gentle drift ──
    if (nebulaRef.current) {
      const arr = nebulaRef.current.geometry.attributes.position.array;
      const vels = nebula.vels;
      const count = arr.length / 3;
      for (let i = 0; i < count; i++) {
        const idx = i * 3;
        arr[idx] += vels[idx];
        arr[idx + 1] += vels[idx + 1];
        arr[idx + 2] += vels[idx + 2];
        // Soft boundary bounce
        const dx = arr[idx] - COORDS.nebula[0];
        const dy = arr[idx + 1] - COORDS.nebula[1];
        const dz = arr[idx + 2] - COORDS.nebula[2];
        if (Math.sqrt(dx*dx + dy*dy + dz*dz) > 4.5) {
          vels[idx] *= -1; vels[idx+1] *= -1; vels[idx+2] *= -1;
        }
      }
      nebulaRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // ── Quasar jets streaming + disk spin ──
    if (quasarRef.current) {
      const arr = quasarRef.current.geometry.attributes.position.array;
      const count = arr.length / 3;
      for (let i = 0; i < count; i++) {
        const idx = i * 3;
        if (i >= 2500) {
          // Jet particles stream along Y
          const dir = i % 2 === 0 ? 1 : -1;
          arr[idx + 1] += 0.06 * dir;
          const dy = arr[idx + 1] - COORDS.quasar[1];
          if (Math.abs(dy) > 8.0) {
            arr[idx] = COORDS.quasar[0] + (Math.random() - 0.5) * 0.06;
            arr[idx + 1] = COORDS.quasar[1];
            arr[idx + 2] = COORDS.quasar[2] + (Math.random() - 0.5) * 0.06;
          }
        } else {
          // Disk rotation
          const dx = arr[idx] - COORDS.quasar[0];
          const dz = arr[idx + 2] - COORDS.quasar[2];
          const r = Math.sqrt(dx*dx + dz*dz);
          const a = Math.atan2(dz, dx) + 0.025;
          arr[idx] = COORDS.quasar[0] + Math.cos(a) * r;
          arr[idx + 2] = COORDS.quasar[2] + Math.sin(a) * r;
        }
      }
      quasarRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // ── Pulsar pulsing + expanding magnetic waves ──
    if (pulsarMeshRef.current) {
      const s = 0.5 + Math.sin(time * 8) * 0.12;
      pulsarMeshRef.current.scale.set(s, s, s);
    }
    if (pulsarRef.current) {
      const arr = pulsarRef.current.geometry.attributes.position.array;
      const count = arr.length / 3;
      for (let i = 0; i < count; i++) {
        const idx = i * 3;
        const ring = i % 5;
        const baseR = 0.8 + ring * 0.7;
        const dx = arr[idx] - COORDS.pulsar[0];
        const dz = arr[idx + 2] - COORDS.pulsar[2];
        let r = Math.sqrt(dx*dx + dz*dz);
        r += 0.012;
        if (r > baseR + 0.8) r = baseR;
        const a = Math.atan2(dz, dx) + 0.004;
        arr[idx] = COORDS.pulsar[0] + Math.cos(a) * r;
        arr[idx + 2] = COORDS.pulsar[2] + Math.sin(a) * r;
      }
      pulsarRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // ── Cosmic dust subtle drift ──
    if (dustRef.current) {
      const arr = dustRef.current.geometry.attributes.position.array;
      for (let i = 0; i < arr.length / 3; i++) {
        arr[i * 3 + 1] += Math.sin(time + i) * 0.001;
      }
      dustRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* ══════ BACKGROUND STARFIELD ══════ */}
      <Points positions={starfield} stride={3}>
        <PointMaterial transparent color="#ffffff" size={0.08} sizeAttenuation depthWrite={false} />
      </Points>

      {/* ══════ COSMIC DUST (atmospheric haze along the camera path) ══════ */}
      <Points ref={dustRef} positions={cosmicDust.pos} colors={cosmicDust.cols} stride={3}>
        <PointMaterial transparent vertexColors size={0.12} sizeAttenuation depthWrite={false}
          blending={THREE.AdditiveBlending} opacity={0.3} map={glowTex} />
      </Points>

      {/* ══════════════════════════════════════════════════════════════════════
          1. BLACK HOLE (Hero) — Solid core + corona glow + spinning accretion disk
          ══════════════════════════════════════════════════════════════════════ */}
      <group position={COORDS.blackHole}>
        {/* Event horizon — solid black sphere */}
        <mesh>
          <sphereGeometry args={[0.9, 32, 32]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
        {/* Corona glow halo — emissive transparent sphere */}
        <mesh ref={blackHoleCoronaRef}>
          <sphereGeometry args={[1.0, 32, 32]} />
          <meshBasicMaterial color="#fbbf24" transparent opacity={0.12}
            blending={THREE.AdditiveBlending} side={THREE.BackSide} />
        </mesh>
        {/* Swirling accretion disk particles */}
        <Points ref={blackHoleDiskRef} positions={blackHoleDisk.pos} colors={blackHoleDisk.cols} stride={3}>
          <PointMaterial transparent vertexColors size={0.12} sizeAttenuation depthWrite={false}
            blending={THREE.AdditiveBlending} map={glowTex} />
        </Points>
      </group>

      {/* ══════════════════════════════════════════════════════════════════════
          2. ORBITING SYSTEM (Internships) — Glowing central star + orbital bands
          ══════════════════════════════════════════════════════════════════════ */}
      <group position={COORDS.orbits}>
        {/* Central star — emissive bright sphere */}
        <mesh>
          <sphereGeometry args={[0.4, 24, 24]} />
          <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={3} />
        </mesh>
        {/* Glow halo around the star */}
        <mesh>
          <sphereGeometry args={[0.7, 24, 24]} />
          <meshBasicMaterial color="#00d4ff" transparent opacity={0.08}
            blending={THREE.AdditiveBlending} side={THREE.BackSide} />
        </mesh>
        <Points ref={orbitRingsRef} positions={orbitRings.pos} colors={orbitRings.cols} stride={3}>
          <PointMaterial transparent vertexColors size={0.1} sizeAttenuation depthWrite={false}
            blending={THREE.AdditiveBlending} map={glowTex} />
        </Points>
      </group>

      {/* ══════════════════════════════════════════════════════════════════════
          3. VOLUMETRIC NEBULA (Projects) — Large overlapping gas cloud particles
          ══════════════════════════════════════════════════════════════════════ */}
      <Points ref={nebulaRef} positions={nebula.pos} colors={nebula.cols} stride={3}>
        <PointMaterial transparent vertexColors size={0.45} sizeAttenuation depthWrite={false}
          blending={THREE.AdditiveBlending} opacity={0.2} map={glowTex} />
      </Points>

      {/* ══════════════════════════════════════════════════════════════════════
          4. QUASAR (Skills) — Core + accretion ring + vertical polar jets
          ══════════════════════════════════════════════════════════════════════ */}
      <group position={COORDS.quasar}>
        {/* Hot white core */}
        <mesh>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={5} />
        </mesh>
        {/* Core glow */}
        <mesh>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshBasicMaterial color="#00d4ff" transparent opacity={0.1}
            blending={THREE.AdditiveBlending} side={THREE.BackSide} />
        </mesh>
        <Points ref={quasarRef} positions={quasar.pos} colors={quasar.cols} stride={3}>
          <PointMaterial transparent vertexColors size={0.1} sizeAttenuation depthWrite={false}
            blending={THREE.AdditiveBlending} map={glowTex} />
        </Points>
      </group>

      {/* ══════════════════════════════════════════════════════════════════════
          5. PULSAR (Certifications) — Pulsing star + expanding magnetic rings
          ══════════════════════════════════════════════════════════════════════ */}
      <group position={COORDS.pulsar}>
        {/* Pulsing star core */}
        <mesh ref={pulsarMeshRef}>
          <sphereGeometry args={[0.4, 24, 24]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={4} />
        </mesh>
        {/* Glow halo */}
        <mesh>
          <sphereGeometry args={[0.8, 24, 24]} />
          <meshBasicMaterial color="#fbbf24" transparent opacity={0.08}
            blending={THREE.AdditiveBlending} side={THREE.BackSide} />
        </mesh>
        <Points ref={pulsarRef} positions={pulsar.pos} colors={pulsar.cols} stride={3}>
          <PointMaterial transparent vertexColors size={0.09} sizeAttenuation depthWrite={false}
            blending={THREE.AdditiveBlending} map={glowTex} />
        </Points>
      </group>
    </group>
  );
}
