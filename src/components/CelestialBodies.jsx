import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

export default function CelestialBodies({ scrollProgress, activeSection, mousePos }) {
  const pointsRef = useRef();
  const groupRef = useRef();

  const particleCount = 35000;

  // Generate a double-arm spiral galaxy layout
  const [positions, colors, phases, radii, originalY] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const cols = new Float32Array(particleCount * 3);
    const phs = new Float32Array(particleCount);
    const rads = new Float32Array(particleCount);
    const origY = new Float32Array(particleCount);

    const cyan = new THREE.Color("#00d4ff");
    const purple = new THREE.Color("#7c3aed");
    const magenta = new THREE.Color("#a855f7");
    const gold = new THREE.Color("#fbbf24");
    const white = new THREE.Color("#f8fafc");

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      phs[i] = Math.random() * Math.PI * 2;

      // 1. Distribute particles into Bulge, Arms, or Halo Haze
      if (i < 8000) {
        // --- CENTRAL BULGE (Dense sphere at the center) ---
        const radius = Math.pow(Math.random(), 2) * 1.5; // Dense core falloff
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);

        pos[idx] = radius * Math.sin(phi) * Math.cos(theta);
        pos[idx + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.7; // slightly flattened
        pos[idx + 2] = radius * Math.cos(phi);

        rads[i] = radius;
        origY[i] = pos[idx + 1];

        // Central bulge colors: hot white core blending to warm gold
        const targetColor = Math.random() > 0.4 ? white : gold;
        cols[idx] = targetColor.r;
        cols[idx + 1] = targetColor.g;
        cols[idx + 2] = targetColor.b;

      } else if (i < 30000) {
        // --- SPIRAL ARMS (Double logarithmic spiral) ---
        const armIndex = i % 2; // 2 distinct arms
        const angleOffset = armIndex * Math.PI; // Offset second arm by 180 degrees
        
        // Logarithmic spiral math: theta determines radius
        const theta = Math.random() * 8.0; // curl intensity
        const radius = 1.0 + theta * 1.2; // radius increases with curl angle
        
        // Add random scatter to make arms volumetric
        const scatterX = (Math.random() - 0.5) * (0.8 + theta * 0.15);
        const scatterY = (Math.random() - 0.5) * (0.3 + theta * 0.05);
        const scatterZ = (Math.random() - 0.5) * (0.8 + theta * 0.15);

        const x = Math.cos(theta + angleOffset) * radius + scatterX;
        const z = Math.sin(theta + angleOffset) * radius + scatterZ;
        const y = scatterY;

        pos[idx] = x;
        pos[idx + 1] = y;
        pos[idx + 2] = z;

        rads[i] = Math.sqrt(x*x + z*z);
        origY[i] = y;

        // Spiral arm colors: cyan inner arm, purple/magenta outer arm
        let targetColor;
        if (radius < 4.0) {
          targetColor = Math.random() > 0.5 ? cyan : purple;
        } else {
          targetColor = Math.random() > 0.4 ? purple : magenta;
        }

        cols[idx] = targetColor.r;
        cols[idx + 1] = targetColor.g;
        cols[idx + 2] = targetColor.b;

      } else {
        // --- STAR HALO HAZE (Wide sparse background stars) ---
        const radius = 4.0 + Math.random() * 15.0;
        const angle = Math.random() * Math.PI * 2;
        
        pos[idx] = Math.cos(angle) * radius;
        pos[idx + 1] = (Math.random() - 0.5) * 3.0; // thin disk
        pos[idx + 2] = Math.sin(angle) * radius;

        rads[i] = radius;
        origY[i] = pos[idx + 1];

        // Background stars: cool blue-white
        cols[idx] = cyan.r * 0.4 + white.r * 0.6;
        cols[idx + 1] = cyan.g * 0.4 + white.g * 0.6;
        cols[idx + 2] = cyan.b * 0.4 + white.b * 0.6;
      }
    }
    return [pos, cols, phs, rads, origY];
  }, []);

  // GSAP Camera flight coordinates targeting regions of the galaxy on scroll
  const sectionTargets = useMemo(() => [
    { // Hero: Close-up on the glowing galactic core (the Black Hole region)
      camPos: [0, 2.5, 5],
      lookAt: [0, 0, 0]
    },
    { // Internships: Move camera sideways overlooking the inner orbiting arm
      camPos: [-3.8, 1.2, 4],
      lookAt: [1.0, -0.2, 0.5]
    },
    { // Projects: Submerge camera directly inside the purple/magenta dust clouds of the outer arm (Nebula view)
      camPos: [3.5, -0.8, 4.5],
      lookAt: [-1.2, 0.4, -0.8]
    },
    { // Skills: Align camera vertically directly above the core (Quasar perspective, looking down the Y-axis)
      camPos: [0, 8, 0.1],
      lookAt: [0, 0, 0]
    },
    { // Certifications: Fly camera into a side view focusing on the pulsing central ring
      camPos: [-2.5, 0.4, 5.5],
      lookAt: [0.8, 0, 0.2]
    },
    { // Contact: Zoom camera far out, presenting the complete majestic spiral galaxy layout
      camPos: [0, 9, 14],
      lookAt: [0, 0, 0]
    }
  ], []);

  // Frame animation loop
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const { camera } = state;

    // 1. Scroll-driven camera interpolation
    const currentProgress = scrollProgress; // value from 0 to 5
    const baseIdx = Math.min(Math.floor(currentProgress), sectionTargets.length - 2);
    const alpha = currentProgress - baseIdx;

    const tCurrent = sectionTargets[baseIdx];
    const tNext = sectionTargets[baseIdx + 1];

    if (tCurrent && tNext) {
      // Lerp camera coordinates
      const targetCamX = THREE.MathUtils.lerp(tCurrent.camPos[0], tNext.camPos[0], alpha);
      const targetCamY = THREE.MathUtils.lerp(tCurrent.camPos[1], tNext.camPos[1], alpha);
      const targetCamZ = THREE.MathUtils.lerp(tCurrent.camPos[2], tNext.camPos[2], alpha);

      const targetLookX = THREE.MathUtils.lerp(tCurrent.lookAt[0], tNext.lookAt[0], alpha);
      const targetLookY = THREE.MathUtils.lerp(tCurrent.lookAt[1], tNext.lookAt[1], alpha);
      const targetLookZ = THREE.MathUtils.lerp(tCurrent.lookAt[2], tNext.lookAt[2], alpha);

      // Smooth camera position interpolation
      camera.position.set(
        THREE.MathUtils.lerp(camera.position.x, targetCamX, 0.05),
        THREE.MathUtils.lerp(camera.position.y, targetCamY, 0.05),
        THREE.MathUtils.lerp(camera.position.z, targetCamZ, 0.05)
      );

      // Apply look-at smooth targeting
      const tempLookAt = new THREE.Vector3(targetLookX, targetLookY, targetLookZ);
      camera.lookAt(tempLookAt);
    }

    // 2. Mouse Parallax (adds spatial depth on movement)
    camera.position.x += mousePos.x * 0.2;
    camera.position.y += mousePos.y * 0.2;

    // 3. Galactic Rotation & Orbiting Dynamics
    if (pointsRef.current) {
      const positionsArray = pointsRef.current.geometry.attributes.position.array;

      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        const radius = radii[i];
        
        // Skip static outer starfield points from heavy orbit animation to save cycles
        if (radius > 12.0) continue;

        // Differential rotation: stars closer to core revolve faster
        const orbitSpeed = 0.08 / Math.max(radius, 0.4);
        const currentAngle = Math.atan2(positionsArray[idx + 2], positionsArray[idx]) + orbitSpeed;

        positionsArray[idx] = Math.cos(currentAngle) * radius;
        // Add subtle wave oscillation on Y-axis (vertical thickness wave)
        positionsArray[idx + 1] = originalY[i] + Math.sin(time + phases[i]) * (0.05 + radius * 0.015);
        positionsArray[idx + 2] = Math.sin(currentAngle) * radius;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Rotate the entire galaxy group slowly
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.015;
    }
  });

  return (
    <group ref={groupRef}>
      <Points ref={pointsRef} positions={positions} colors={colors} stride={3}>
        <PointMaterial
          transparent
          vertexColors
          size={0.065}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}
