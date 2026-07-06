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

export default function CelestialBodies({ scrollProgress, mousePos }) {
  const starsRef = useRef();
  const nebulaRef = useRef();
  const gridRef = useRef();
  const groupRef = useRef();

  const glowTex = useMemo(() => createGlowTexture(), []);

  // ─── 1. GLOBAL BACKGROUND STARFIELD (15,000 particles) ──────────────────────
  const starfield = useMemo(() => {
    const count = 15000;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 80 + Math.random() * 60; // Huge outer bubble
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  // ─── 2. VOLUMETRIC COSMIC GAS LANES (15,000 large particles) ─────────────────
  const nebula = useMemo(() => {
    const count = 15000;
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const vels = new Float32Array(count * 3);

    const cyan = new THREE.Color("#00d4ff");
    const purple = new THREE.Color("#7c3aed");
    const magenta = new THREE.Color("#a855f7");

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      // Form a dense snake-like dust lane weaving through the Z path
      const z = -(i / count) * 45; // spans Z: 0 to -45
      const angle = (z * 0.15) + (Math.random() - 0.5) * 1.5;
      const r = 2.0 + Math.pow(Math.random(), 1.5) * 4.0; // variable thickness

      pos[idx] = Math.cos(angle) * r;
      pos[idx + 1] = Math.sin(angle) * r + (Math.random() - 0.5) * 2;
      pos[idx + 2] = z;

      // Color waves weaving along the Z lane
      let colorMix;
      if (z > -10) colorMix = cyan;
      else if (z > -25) colorMix = purple;
      else colorMix = magenta;

      // Add core glow blending (hot white highlights near center of the lane)
      const hotWhite = new THREE.Color("#f8fafc");
      const c = r < 2.5 && Math.random() > 0.6 ? hotWhite : colorMix;

      cols[idx] = c.r;
      cols[idx + 1] = c.g;
      cols[idx + 2] = c.b;

      // Slow drift movement
      vels[idx] = (Math.random() - 0.5) * 0.005;
      vels[idx + 1] = (Math.random() - 0.5) * 0.005;
      vels[idx + 2] = (Math.random() - 0.5) * 0.005;
    }
    return { pos, cols, vels };
  }, []);

  // ─── 3. GEOMETRIC COORDINATE CONSTELLATION WEB (10,000 points) ──────────────
  const coordinateGrid = useMemo(() => {
    const count = 10000;
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const cyan = new THREE.Color("#00d4ff");
    const white = new THREE.Color("#ffffff");

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      // Align points on geometric mathematical grid cells in 3D
      const gridX = Math.round((Math.random() - 0.5) * 24) * 1.5;
      const gridY = Math.round((Math.random() - 0.5) * 12) * 1.5;
      const gridZ = Math.round(Math.random() * -30) * 1.5;

      pos[idx] = gridX + (Math.random() - 0.5) * 0.1;
      pos[idx + 1] = gridY + (Math.random() - 0.5) * 0.1;
      pos[idx + 2] = gridZ + (Math.random() - 0.5) * 0.1;

      // Clean tech colors: cyan grid lines with white nodes
      const isNode = i % 8 === 0;
      const c = isNode ? white : cyan;

      cols[idx] = c.r * (isNode ? 0.8 : 0.25);
      cols[idx + 1] = c.g * (isNode ? 0.8 : 0.25);
      cols[idx + 2] = c.b * (isNode ? 0.8 : 0.25);
    }
    return { pos, cols };
  }, []);

  // ─── CAMERA TOUR CORRIDOR TARGETS ────────────────────────────────────────────
  // Smoothly guides the camera straight down the volumetric dust lane corridor
  const sectionTargets = useMemo(() => [
    { camPos: [0, 0.5, 6], lookAt: [0, 0, -5] },        // Hero: enter the dust lane
    { camPos: [-2.2, 0.8, -4], lookAt: [1, 0, -10] },    // Internships: slide left
    { camPos: [2.5, -0.6, -13], lookAt: [-1, 0, -18] },   // Projects: drift right
    { camPos: [-1.8, 2.0, -22], lookAt: [0, -1, -28] },   // Skills: angle down from top left
    { camPos: [2.0, 0.2, -31], lookAt: [-1.5, 0.5, -36] },// Certifications: drift right
    { camPos: [0, 15, -18], lookAt: [0, -2, -22] }       // Contact: high-altitude panorama
  ], []);

  // ─── FRAME UPDATE ────────────────────────────────────────────────────────────
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const { camera } = state;

    // 1. Camera interpolation along the path
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

      // Fast, smooth spring-like lerping
      camera.position.set(
        THREE.MathUtils.lerp(camera.position.x, tx, 0.08),
        THREE.MathUtils.lerp(camera.position.y, ty, 0.08),
        THREE.MathUtils.lerp(camera.position.z, tz, 0.08)
      );
      camera.lookAt(new THREE.Vector3(lx, ly, lz));
    }

    // 2. Mouse Parallax (Dynamic tilt of coordinate lines)
    camera.position.x += mousePos.x * 0.2;
    camera.position.y += mousePos.y * 0.2;

    // 3. Volumetric Gas drift animation
    if (nebulaRef.current) {
      const arr = nebulaRef.current.geometry.attributes.position.array;
      const vels = nebula.vels;
      const len = arr.length / 3;
      for (let i = 0; i < len; i++) {
        const idx = i * 3;
        arr[idx] += vels[idx];
        arr[idx + 1] += vels[idx + 1];
        arr[idx + 2] += vels[idx + 2];

        // Soft loop back to keep dust lane volume dense
        if (Math.abs(arr[idx + 1]) > 8) vels[idx + 1] *= -1;
        if (Math.abs(arr[idx]) > 8) vels[idx] *= -1;
      }
      nebulaRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // 4. Slow cosmic grid rotation
    if (gridRef.current) {
      gridRef.current.rotation.z = time * 0.005;
      gridRef.current.rotation.y = Math.sin(time * 0.02) * 0.05;
    }

    // 5. Global group rotation
    if (groupRef.current) {
      groupRef.current.rotation.z = time * 0.002;
    }
  });

  return (
    <group ref={groupRef}>
      {/* GLOBAL BACKGROUND STARFIELD */}
      <Points ref={starsRef} positions={starfield} stride={3}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.065}
          sizeAttenuation={true}
          depthWrite={false}
          map={glowTex}
        />
      </Points>

      {/* GEOMETRIC COORDINATE CONSTELLATION WEB */}
      <Points ref={gridRef} positions={coordinateGrid.pos} colors={coordinateGrid.cols} stride={3}>
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

      {/* VOLUMETRIC COSMIC GAS LANES */}
      <Points ref={nebulaRef} positions={nebula.pos} colors={nebula.cols} stride={3}>
        <PointMaterial
          transparent
          vertexColors
          size={0.4} // Big overlapping sizes create dense gas look
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.3}
          map={glowTex}
        />
      </Points>
    </group>
  );
}
