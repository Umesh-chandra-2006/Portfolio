import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

export default function CelestialBodies({ scrollProgress, activeSection, mousePos }) {
  const pointsRef = useRef();
  const groupRef = useRef();

  // Create particle positions, colors, and initial states
  const particleCount = 3000;
  const [positions, colors, sizes, phases, velocities] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const cols = new Float32Array(particleCount * 3);
    const sz = new Float32Array(particleCount);
    const phs = new Float32Array(particleCount);
    const vls = new Float32Array(particleCount * 3);

    const cyan = new THREE.Color("#00d4ff");
    const purple = new THREE.Color("#7c3aed");
    const magenta = new THREE.Color("#a855f7");
    const gold = new THREE.Color("#fbbf24");
    const white = new THREE.Color("#e2e8f0");

    for (let i = 0; i < particleCount; i++) {
      // Spanned distribution in space
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.5 + Math.random() * 8;
      
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() * 2 - 1) * 2;
      pos[i * 3 + 2] = Math.sin(angle) * radius;

      // Color distribution (default violet/cyan blend)
      const mixColor = Math.random() > 0.5 ? cyan : purple;
      cols[i * 3] = mixColor.r;
      cols[i * 3 + 1] = mixColor.g;
      cols[i * 3 + 2] = mixColor.b;

      sz[i] = 0.05 + Math.random() * 0.15;
      phs[i] = Math.random() * Math.PI * 2;

      // Velocity vectors for drift
      vls[i * 3] = (Math.random() * 2 - 1) * 0.02;
      vls[i * 3 + 1] = (Math.random() * 2 - 1) * 0.02;
      vls[i * 3 + 2] = (Math.random() * 2 - 1) * 0.02;
    }
    return [pos, cols, sz, phs, vls];
  }, []);

  // Targets for camera coordinates and scene positions per section
  const sectionTargets = useMemo(() => [
    { // Section 0: Hero (Black Hole)
      camPos: [0, 1, 6],
      lookAt: [0, 0, 0],
      particleScale: 1.0,
      morphFactor: 0
    },
    { // Section 1: Internships (Orbit System)
      camPos: [-2, 0.5, 5],
      lookAt: [1.2, 0, 0],
      particleScale: 0.9,
      morphFactor: 1
    },
    { // Section 2: Projects (Nebula)
      camPos: [2.5, -0.5, 4.5],
      lookAt: [-1.0, 0, 0],
      particleScale: 1.4,
      morphFactor: 2
    },
    { // Section 3: Skills (Quasar Jet)
      camPos: [0, 3, 5],
      lookAt: [0, 0, 0],
      particleScale: 0.8,
      morphFactor: 3
    },
    { // Section 4: Certifications (Pulsar)
      camPos: [-2, 0.2, 5.5],
      lookAt: [1.0, 0, 0],
      particleScale: 1.1,
      morphFactor: 4
    },
    { // Section 5: Contact (Deep Starfield)
      camPos: [0, 0, 8],
      lookAt: [0, 0, 0],
      particleScale: 1.5,
      morphFactor: 5
    }
  ], []);

  // Frame update logic
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const { camera } = state;

    // 1. Calculate active section and interpolation target
    const currentProgress = scrollProgress; // value from 0 to 5
    const baseIdx = Math.min(Math.floor(currentProgress), sectionTargets.length - 2);
    const alpha = currentProgress - baseIdx;

    const tCurrent = sectionTargets[baseIdx];
    const tNext = sectionTargets[baseIdx + 1];

    if (!tCurrent || !tNext) return;

    // 2. Camera Lerping (Scroll Flight)
    const targetCamX = THREE.MathUtils.lerp(tCurrent.camPos[0], tNext.camPos[0], alpha);
    const targetCamY = THREE.MathUtils.lerp(tCurrent.camPos[1], tNext.camPos[1], alpha);
    const targetCamZ = THREE.MathUtils.lerp(tCurrent.camPos[2], tNext.camPos[2], alpha);

    const targetLookX = THREE.MathUtils.lerp(tCurrent.lookAt[0], tNext.lookAt[0], alpha);
    const targetLookY = THREE.MathUtils.lerp(tCurrent.lookAt[1], tNext.lookAt[1], alpha);
    const targetLookZ = THREE.MathUtils.lerp(tCurrent.lookAt[2], tNext.lookAt[2], alpha);

    // Camera target alignment
    camera.position.set(
      THREE.MathUtils.lerp(camera.position.x, targetCamX, 0.08),
      THREE.MathUtils.lerp(camera.position.y, targetCamY, 0.08),
      THREE.MathUtils.lerp(camera.position.z, targetCamZ, 0.08)
    );

    // Apply lookAt smoothly
    const tempLookAt = new THREE.Vector3(targetLookX, targetLookY, targetLookZ);
    camera.lookAt(tempLookAt);

    // 3. Mouse Parallax (adds 3D depth)
    camera.position.x += mousePos.x * 0.15;
    camera.position.y += mousePos.y * 0.15;

    // 4. Animate particles depending on active section profile
    if (pointsRef.current) {
      const positionsArray = pointsRef.current.geometry.attributes.position.array;
      const colorsArray = pointsRef.current.geometry.attributes.color.array;

      const cyan = new THREE.Color("#00d4ff");
      const purple = new THREE.Color("#7c3aed");
      const magenta = new THREE.Color("#a855f7");
      const gold = new THREE.Color("#fbbf24");
      const white = new THREE.Color("#e2e8f0");

      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        const phase = phases[i];
        
        // Base coordinate values
        let x = positionsArray[idx];
        let y = positionsArray[idx + 1];
        let z = positionsArray[idx + 2];

        // Read active morph profiles (Black Hole -> Orbit -> Nebula -> Quasar -> Pulsar -> Starfield)
        const activeMorph = THREE.MathUtils.lerp(tCurrent.morphFactor, tNext.morphFactor, alpha);

        if (activeMorph < 1.0) {
          // BLACK HOLE accretion disk orbit
          const r = Math.sqrt(x*x + z*z);
          const speed = 0.5 / Math.max(r, 0.1);
          const nextAngle = Math.atan2(z, x) + speed * 0.02;
          
          positionsArray[idx] = Math.cos(nextAngle) * r;
          positionsArray[idx + 1] = Math.sin(time + phase) * 0.05; // flat disk
          positionsArray[idx + 2] = Math.sin(nextAngle) * r;

          // Accretion disk colors (warm gold + magenta blend)
          const targetColor = i % 3 === 0 ? gold : (i % 3 === 1 ? magenta : purple);
          colorsArray[idx] = THREE.MathUtils.lerp(colorsArray[idx], targetColor.r, 0.05);
          colorsArray[idx + 1] = THREE.MathUtils.lerp(colorsArray[idx + 1], targetColor.g, 0.05);
          colorsArray[idx + 2] = THREE.MathUtils.lerp(colorsArray[idx + 2], targetColor.b, 0.05);

        } else if (activeMorph < 2.0) {
          // ORBIT internships (2-3 orbiting bands)
          const ringIndex = i % 3;
          const radius = 1.5 + ringIndex * 1.2;
          const speed = 0.01 * (3 - ringIndex);
          const nextAngle = Math.atan2(z, x) + speed;

          positionsArray[idx] = Math.cos(nextAngle) * radius;
          positionsArray[idx + 1] = THREE.MathUtils.lerp(y, Math.sin(time + phase) * 0.08, 0.05);
          positionsArray[idx + 2] = Math.sin(nextAngle) * radius;

          // Pure orbit system colors (cyan and white)
          const targetColor = ringIndex === 0 ? cyan : white;
          colorsArray[idx] = THREE.MathUtils.lerp(colorsArray[idx], targetColor.r, 0.05);
          colorsArray[idx + 1] = THREE.MathUtils.lerp(colorsArray[idx + 1], targetColor.g, 0.05);
          colorsArray[idx + 2] = THREE.MathUtils.lerp(colorsArray[idx + 2], targetColor.b, 0.05);

        } else if (activeMorph < 3.0) {
          // NEBULA projects (drifting dust cloud)
          positionsArray[idx] += velocities[idx] * 0.1;
          positionsArray[idx + 1] += velocities[idx + 1] * 0.1;
          positionsArray[idx + 2] += velocities[idx + 2] * 0.1;

          // Re-contain particles inside a bounds
          const dist = Math.sqrt(x*x + y*y + z*z);
          if (dist > 8.0) {
            positionsArray[idx] = (Math.random() * 2 - 1) * 3;
            positionsArray[idx + 1] = (Math.random() * 2 - 1) * 3;
            positionsArray[idx + 2] = (Math.random() * 2 - 1) * 3;
          }

          // Nebula colors (magenta, purple, and cyan clouds)
          const targetColor = i % 3 === 0 ? purple : (i % 3 === 1 ? magenta : cyan);
          colorsArray[idx] = THREE.MathUtils.lerp(colorsArray[idx], targetColor.r, 0.05);
          colorsArray[idx + 1] = THREE.MathUtils.lerp(colorsArray[idx + 1], targetColor.g, 0.05);
          colorsArray[idx + 2] = THREE.MathUtils.lerp(colorsArray[idx + 2], targetColor.b, 0.05);

        } else if (activeMorph < 4.0) {
          // QUASAR skills (focused vertical particle beams + core explosion)
          if (i % 3 === 0) {
            // Vertical jet beam
            positionsArray[idx] = Math.sin(time * 5 + phase) * 0.15;
            positionsArray[idx + 1] = ((i % 100) / 100) * 8.0 - 4.0; // dynamic height
            positionsArray[idx + 2] = Math.cos(time * 5 + phase) * 0.15;
          } else {
            // Dense center rotation
            const radius = 0.4 + Math.random() * 1.5;
            const nextAngle = Math.atan2(z, x) + 0.04;
            positionsArray[idx] = Math.cos(nextAngle) * radius;
            positionsArray[idx + 1] = THREE.MathUtils.lerp(y, (Math.random() * 2 - 1) * 0.4, 0.05);
            positionsArray[idx + 2] = Math.sin(nextAngle) * radius;
          }

          // Quasar colors (hot cyan + bright white)
          const targetColor = i % 2 === 0 ? cyan : white;
          colorsArray[idx] = THREE.MathUtils.lerp(colorsArray[idx], targetColor.r, 0.05);
          colorsArray[idx + 1] = THREE.MathUtils.lerp(colorsArray[idx + 1], targetColor.g, 0.05);
          colorsArray[idx + 2] = THREE.MathUtils.lerp(colorsArray[idx + 2], targetColor.b, 0.05);

        } else {
          // STARFIELD contact (static wide field)
          const targetColor = white;
          colorsArray[idx] = THREE.MathUtils.lerp(colorsArray[idx], targetColor.r, 0.05);
          colorsArray[idx + 1] = THREE.MathUtils.lerp(colorsArray[idx + 1], targetColor.g, 0.05);
          colorsArray[idx + 2] = THREE.MathUtils.lerp(colorsArray[idx + 2], targetColor.b, 0.05);
        }
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      pointsRef.current.geometry.attributes.color.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      <Points ref={pointsRef} positions={positions} colors={colors} stride={3}>
        <PointMaterial
          transparent
          vertexColors
          size={0.06}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}
