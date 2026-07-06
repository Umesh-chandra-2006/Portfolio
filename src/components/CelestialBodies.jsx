import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// ─── HELPER FOR CREATING CIRCULAR TEXTURES ─────────────────────────────────────
// Generates a soft circular radial gradient for glowing particles
function createGlowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
  grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
  grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export default function CelestialBodies({ scrollProgress, activeSection, mousePos }) {
  const groupRef = useRef();
  const blackHoleDiskRef = useRef();
  const orbitRingsRef = useRef();
  const nebulaRef = useRef();
  const quasarRef = useRef();
  const pulsarRef = useRef();
  const pulsarMeshRef = useRef();

  const glowTex = useMemo(() => createGlowTexture(), []);

  // ─── 3D SCENE COORDINATES MAP ────────────────────────────────────────────────
  const COORDS = {
    blackHole: [0, 0, 0],
    orbits: [-15, -2, -15],
    nebula: [20, -5, -30],
    quasar: [-30, 8, -45],
    pulsar: [25, 5, -60]
  };

  // ─── CAMERA TOUR FLIGHT TARGETS ──────────────────────────────────────────────
  const sectionTargets = useMemo(() => [
    { // Hero: Close-up on the black hole
      camPos: [0, 1.5, 6.5],
      lookAt: COORDS.blackHole
    },
    { // Internships: Orbiting System
      camPos: [-15, 0.5, -9.5],
      lookAt: COORDS.orbits
    },
    { // Projects: Submerged inside the Nebula
      camPos: [15, -3.5, -24.5],
      lookAt: COORDS.nebula
    },
    { // Skills: Vertical top-down look at the Quasar vertical jet
      camPos: [-30, 14, -44.9],
      lookAt: COORDS.quasar
    },
    { // Certifications: Looking directly at the pulsing Pulsar core
      camPos: [18, 5, -53.5],
      lookAt: COORDS.pulsar
    },
    { // Contact: Zoomed out, overview of the whole universe
      camPos: [0, 35, -25],
      lookAt: [0, 0, -30]
    }
  ], []);

  // ─── 1. GLOBAL BACKGROUND STARFIELD (10,000 particles) ────────────────────────
  const starfield = useMemo(() => {
    const count = 10000;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      // Scatter in a massive hollow sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 100 + Math.random() * 50;

      pos[idx] = radius * Math.sin(phi) * Math.cos(theta);
      pos[idx + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[idx + 2] = radius * Math.cos(phi);
    }
    return pos;
  }, []);

  // ─── 2. BLACK HOLE ACCRETION DISK (8,000 particles) ──────────────────────────
  const blackHoleDisk = useMemo(() => {
    const count = 8000;
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const gold = new THREE.Color("#fbbf24");
    const magenta = new THREE.Color("#a855f7");

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.0 + Math.pow(Math.random(), 2) * 3.5; // Dense inner disk

      pos[idx] = Math.cos(angle) * radius;
      pos[idx + 1] = (Math.random() - 0.5) * 0.1; // Flat disk
      pos[idx + 2] = Math.sin(angle) * radius;

      // Color gradient: warm gold near the horizon, magenta/violet at the edge
      const colorMix = radius < 2.0 ? gold : magenta;
      cols[idx] = colorMix.r;
      cols[idx + 1] = colorMix.g;
      cols[idx + 2] = colorMix.b;
    }
    return { pos, cols };
  }, []);

  // ─── 3. ORBITING PLANETARY SYSTEM (4,000 particles) ──────────────────────────
  const orbitRings = useMemo(() => {
    const count = 4000;
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const cyan = new THREE.Color("#00d4ff");
    const white = new THREE.Color("#f8fafc");

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const ringIndex = i % 3; // 3 concentric rings
      const radius = 1.2 + ringIndex * 0.9;
      const angle = Math.random() * Math.PI * 2;

      pos[idx] = COORDS.orbits[0] + Math.cos(angle) * radius;
      pos[idx + 1] = COORDS.orbits[1] + (Math.random() - 0.5) * 0.05;
      pos[idx + 2] = COORDS.orbits[2] + Math.sin(angle) * radius;

      const colorMix = ringIndex === 0 ? cyan : white;
      cols[idx] = colorMix.r;
      cols[idx + 1] = colorMix.g;
      cols[idx + 2] = colorMix.b;
    }
    return { pos, cols };
  }, []);

  // ─── 4. VOLUMETRIC NEBULA (5,000 particles) ──────────────────────────────────
  const nebula = useMemo(() => {
    const count = 5000;
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    
    const purple = new THREE.Color("#7c3aed");
    const magenta = new THREE.Color("#a855f7");
    const cyan = new THREE.Color("#00d4ff");

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      // Distribute in overlapping spherical clusters to build thickness
      const clusterOffset = i % 3 === 0 ? -1.5 : (i % 3 === 1 ? 0 : 1.5);
      
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = Math.random() * 3.5;

      pos[idx] = COORDS.nebula[0] + radius * Math.sin(phi) * Math.cos(theta) + clusterOffset;
      pos[idx + 1] = COORDS.nebula[1] + radius * Math.sin(phi) * Math.sin(theta) * 0.8;
      pos[idx + 2] = COORDS.nebula[2] + radius * Math.cos(phi);

      const colorMix = i % 3 === 0 ? purple : (i % 3 === 1 ? magenta : cyan);
      cols[idx] = colorMix.r;
      cols[idx + 1] = colorMix.g;
      cols[idx + 2] = colorMix.b;

      // Drift velocities
      velocities[idx] = (Math.random() - 0.5) * 0.05;
      velocities[idx + 1] = (Math.random() - 0.5) * 0.05;
      velocities[idx + 2] = (Math.random() - 0.5) * 0.05;
    }
    return { pos, cols, velocities };
  }, []);

  // ─── 5. QUASAR JETS (5,000 particles) ────────────────────────────────────────
  const quasar = useMemo(() => {
    const count = 5000;
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const cyan = new THREE.Color("#00d4ff");
    const white = new THREE.Color("#f8fafc");

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      
      if (i < 2000) {
        // Accretion disk around quasar core
        const angle = Math.random() * Math.PI * 2;
        const radius = 0.5 + Math.random() * 2.0;
        pos[idx] = COORDS.quasar[0] + Math.cos(angle) * radius;
        pos[idx + 1] = COORDS.quasar[1] + (Math.random() - 0.5) * 0.08;
        pos[idx + 2] = COORDS.quasar[2] + Math.sin(angle) * radius;

        cols[idx] = cyan.r;
        cols[idx + 1] = cyan.g;
        cols[idx + 2] = cyan.b;
      } else {
        // High-velocity vertical polar jets (shooting along Y-axis)
        const direction = i % 2 === 0 ? 1 : -1;
        const height = Math.random() * 6.0;
        const radius = 0.02 + height * 0.05; // Jet spreads out slightly
        const angle = Math.random() * Math.PI * 2;

        pos[idx] = COORDS.quasar[0] + Math.cos(angle) * radius;
        pos[idx + 1] = COORDS.quasar[1] + height * direction;
        pos[idx + 2] = COORDS.quasar[2] + Math.sin(angle) * radius;

        cols[idx] = white.r;
        cols[idx + 1] = white.g;
        cols[idx + 2] = white.b;
      }
    }
    return { pos, cols };
  }, []);

  // ─── 6. PULSAR CONCENTRIC HALOS (3,000 particles) ────────────────────────────
  const pulsar = useMemo(() => {
    const count = 3000;
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const gold = new THREE.Color("#fbbf24");
    const white = new THREE.Color("#f8fafc");

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const angle = Math.random() * Math.PI * 2;
      const ringIndex = i % 4; // 4 magnetic field layers
      const radius = 0.8 + ringIndex * 0.6;

      pos[idx] = COORDS.pulsar[0] + Math.cos(angle) * radius;
      pos[idx + 1] = COORDS.pulsar[1] + (Math.random() - 0.5) * 0.1;
      pos[idx + 2] = COORDS.pulsar[2] + Math.sin(angle) * radius;

      const colorMix = ringIndex % 2 === 0 ? gold : white;
      cols[idx] = colorMix.r;
      cols[idx + 1] = colorMix.g;
      cols[idx + 2] = colorMix.b;
    }
    return { pos, cols };
  }, []);

  // ─── CORE RENDERING ANIMATION LOOP ──────────────────────────────────────────
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const { camera } = state;

    // 1. Camera scroll-routing coordinates calculations
    const currentProgress = scrollProgress; // value from 0 to 5
    const baseIdx = Math.min(Math.floor(currentProgress), sectionTargets.length - 2);
    const alpha = currentProgress - baseIdx;

    const tCurrent = sectionTargets[baseIdx];
    const tNext = sectionTargets[baseIdx + 1];

    if (tCurrent && tNext) {
      const targetCamX = THREE.MathUtils.lerp(tCurrent.camPos[0], tNext.camPos[0], alpha);
      const targetCamY = THREE.MathUtils.lerp(tCurrent.camPos[1], tNext.camPos[1], alpha);
      const targetCamZ = THREE.MathUtils.lerp(tCurrent.camPos[2], tNext.camPos[2], alpha);

      const targetLookX = THREE.MathUtils.lerp(tCurrent.lookAt[0], tNext.lookAt[0], alpha);
      const targetLookY = THREE.MathUtils.lerp(tCurrent.lookAt[1], tNext.lookAt[1], alpha);
      const targetLookZ = THREE.MathUtils.lerp(tCurrent.lookAt[2], tNext.lookAt[2], alpha);

      // Smooth camera interpolation
      camera.position.set(
        THREE.MathUtils.lerp(camera.position.x, targetCamX, 0.05),
        THREE.MathUtils.lerp(camera.position.y, targetCamY, 0.05),
        THREE.MathUtils.lerp(camera.position.z, targetCamZ, 0.05)
      );

      // LookAt Lerp target
      const tempLookAt = new THREE.Vector3(targetLookX, targetLookY, targetLookZ);
      camera.lookAt(tempLookAt);
    }

    // 2. Mouse Parallax (Tilts perspective dynamically)
    camera.position.x += mousePos.x * 0.15;
    camera.position.y += mousePos.y * 0.15;

    // 3. Accretion Disk Rotation (Black Hole)
    if (blackHoleDiskRef.current) {
      const pos = blackHoleDiskRef.current.geometry.attributes.position.array;
      for (let i = 0; i < blackHoleDisk.pos.length / 3; i++) {
        const idx = i * 3;
        const x = pos[idx];
        const z = pos[idx + 2];
        const radius = Math.sqrt(x*x + z*z);
        const orbitSpeed = 0.02 / Math.max(radius, 0.5);
        const angle = Math.atan2(z, x) + orbitSpeed;

        pos[idx] = Math.cos(angle) * radius;
        pos[idx + 2] = Math.sin(angle) * radius;
      }
      blackHoleDiskRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // 4. Concentric orbits rotation (Internships)
    if (orbitRingsRef.current) {
      const pos = orbitRingsRef.current.geometry.attributes.position.array;
      for (let i = 0; i < orbitRings.pos.length / 3; i++) {
        const idx = i * 3;
        const ringIdx = i % 3;
        
        const dx = pos[idx] - COORDS.orbits[0];
        const dz = pos[idx + 2] - COORDS.orbits[2];
        const radius = Math.sqrt(dx*dx + dz*dz);
        const orbitSpeed = 0.005 * (3 - ringIdx);
        const angle = Math.atan2(dz, dx) + orbitSpeed;

        pos[idx] = COORDS.orbits[0] + Math.cos(angle) * radius;
        pos[idx + 2] = COORDS.orbits[2] + Math.sin(angle) * radius;
      }
      orbitRingsRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // 5. Nebula drift animation (Projects)
    if (nebulaRef.current) {
      const pos = nebulaRef.current.geometry.attributes.position.array;
      const vels = nebula.velocities;
      for (let i = 0; i < nebula.pos.length / 3; i++) {
        const idx = i * 3;
        pos[idx] += vels[idx] * 0.1;
        pos[idx + 1] += vels[idx + 1] * 0.1;
        pos[idx + 2] += vels[idx + 2] * 0.1;

        // Bounce drift borders
        const dx = pos[idx] - COORDS.nebula[0];
        const dy = pos[idx + 1] - COORDS.nebula[1];
        const dz = pos[idx + 2] - COORDS.nebula[2];
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
        
        if (dist > 4.5) {
          vels[idx] *= -1;
          vels[idx + 1] *= -1;
          vels[idx + 2] *= -1;
        }
      }
      nebulaRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // 6. Quasar vertical jet streams (Skills)
    if (quasarRef.current) {
      const pos = quasarRef.current.geometry.attributes.position.array;
      for (let i = 0; i < quasar.pos.length / 3; i++) {
        const idx = i * 3;
        
        if (i >= 2000) {
          // polar jet acceleration upward or downward along Y
          const direction = i % 2 === 0 ? 1 : -1;
          pos[idx + 1] += 0.05 * direction;

          // Loop jet particles back to core
          const dy = pos[idx + 1] - COORDS.quasar[1];
          if (Math.abs(dy) > 7.0) {
            pos[idx] = COORDS.quasar[0] + (Math.random() - 0.5) * 0.05;
            pos[idx + 1] = COORDS.quasar[1];
            pos[idx + 2] = COORDS.quasar[2] + (Math.random() - 0.5) * 0.05;
          }
        } else {
          // Accretion disk rotation
          const dx = pos[idx] - COORDS.quasar[0];
          const dz = pos[idx + 2] - COORDS.quasar[2];
          const radius = Math.sqrt(dx*dx + dz*dz);
          const angle = Math.atan2(dz, dx) + 0.02;
          pos[idx] = COORDS.quasar[0] + Math.cos(angle) * radius;
          pos[idx + 2] = COORDS.quasar[2] + Math.sin(angle) * radius;
        }
      }
      quasarRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // 7. Pulsar core pulse scale & concentric field waves (Certifications)
    if (pulsarMeshRef.current) {
      const scale = 1.0 + Math.sin(time * 6.0) * 0.15; // Rapid star flashing pulse
      pulsarMeshRef.current.scale.set(scale, scale, scale);
    }
    if (pulsarRef.current) {
      const pos = pulsarRef.current.geometry.attributes.position.array;
      for (let i = 0; i < pulsar.pos.length / 3; i++) {
        const idx = i * 3;
        const ringIdx = i % 4;
        
        // Compute radius from center
        const dx = pos[idx] - COORDS.pulsar[0];
        const dz = pos[idx + 2] - COORDS.pulsar[2];
        let radius = Math.sqrt(dx*dx + dz*dz);
        const baseRadius = 0.8 + ringIdx * 0.6;
        
        // Expanding wave pulsation
        radius += 0.01;
        if (radius > baseRadius + 0.6) {
          radius = baseRadius; // Reset concentric wave limit
        }

        const angle = Math.atan2(dz, dx) + 0.005;
        pos[idx] = COORDS.pulsar[0] + Math.cos(angle) * radius;
        pos[idx + 2] = COORDS.pulsar[2] + Math.sin(angle) * radius;
      }
      pulsarRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {/* GLOBAL BACKGROUND STARFIELD */}
      <Points positions={starfield} stride={3}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.035}
          sizeAttenuation={true}
          depthWrite={false}
          map={glowTex}
        />
      </Points>

      {/* ========================================================
          1. BLACK HOLE (Hero)
          Solid black core sphere + Swirling gold accretion disk
          ======================================================== */}
      <group position={COORDS.blackHole}>
        <mesh>
          <sphereGeometry args={[0.7, 32, 32]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
        <Points ref={blackHoleDiskRef} positions={blackHoleDisk.pos} colors={blackHoleDisk.cols} stride={3}>
          <PointMaterial
            transparent
            vertexColors
            size={0.09}
            sizeAttenuation={true}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            map={glowTex}
          />
        </Points>
      </group>

      {/* ========================================================
          2. ORBITING PLANETARY SYSTEM (Internships)
          Central white sun + Orbiting concentric star paths
          ======================================================== */}
      <group position={COORDS.orbits}>
        <mesh>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshBasicMaterial color="#00d4ff" />
        </mesh>
        <Points ref={orbitRingsRef} positions={orbitRings.pos} colors={orbitRings.cols} stride={3}>
          <PointMaterial
            transparent
            vertexColors
            size={0.07}
            sizeAttenuation={true}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            map={glowTex}
          />
        </Points>
      </group>

      {/* ========================================================
          3. VOLUMETRIC NEBULA CLOUDS (Projects)
          Thick clusters of purple, magenta, and cyan gas clouds
          ======================================================== */}
      <Points ref={nebulaRef} positions={nebula.pos} colors={nebula.cols} stride={3}>
        <PointMaterial
          transparent
          vertexColors
          size={0.25} // Large sizes overlayed to look like volumetric gases
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.35}
          map={glowTex}
        />
      </Points>

      {/* ========================================================
          4. THE QUASAR (Skills)
          Swirling cyan disk + Double vertical shooting jets
          ======================================================== */}
      <group position={COORDS.quasar}>
        <mesh>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <Points ref={quasarRef} positions={quasar.pos} colors={quasar.cols} stride={3}>
          <PointMaterial
            transparent
            vertexColors
            size={0.08}
            sizeAttenuation={true}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            map={glowTex}
          />
        </Points>
      </group>

      {/* ========================================================
          5. THE PULSAR (Certifications)
          Pulsing amber core + Expanding magnetic field waves
          ======================================================== */}
      <group position={COORDS.pulsar}>
        <mesh ref={pulsarMeshRef}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshBasicMaterial color="#fbbf24" />
        </mesh>
        <Points ref={pulsarRef} positions={pulsar.pos} colors={pulsar.cols} stride={3}>
          <PointMaterial
            transparent
            vertexColors
            size={0.075}
            sizeAttenuation={true}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            map={glowTex}
          />
        </Points>
      </group>
    </group>
  );
}
