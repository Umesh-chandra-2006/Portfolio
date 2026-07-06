import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function MatrixGrid({ mousePos, reducedMotion }) {
  const pointsRef = useRef();
  const count = 4000;

  // Generate grids & columns of coordinates
  const [positions, colors, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    
    const cyan = new THREE.Color("#00d4ff");
    const green = new THREE.Color("#10b981");

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      
      if (i < 2000) {
        // Grid nodes
        const gridX = ((i % 40) - 20) * 0.5;
        const gridZ = (Math.floor(i / 40) - 25) * 0.5;
        pos[idx] = gridX;
        pos[idx + 1] = -1.5; // ground grid
        pos[idx + 2] = gridZ;

        cols[idx] = cyan.r * 0.4;
        cols[idx + 1] = cyan.g * 0.4;
        cols[idx + 2] = cyan.b * 0.4;
        spd[i] = 0;
      } else {
        // Falling code stream columns
        pos[idx] = (Math.random() - 0.5) * 12;
        pos[idx + 1] = Math.random() * 8 - 4;
        pos[idx + 2] = (Math.random() - 0.5) * 8;

        const c = Math.random() > 0.5 ? cyan : green;
        cols[idx] = c.r;
        cols[idx + 1] = c.g;
        cols[idx + 2] = c.b;
        spd[i] = 0.05 + Math.random() * 0.1;
      }
    }
    return [pos, cols, spd];
  }, []);

  useFrame(() => {
    if (reducedMotion) return;

    if (pointsRef.current) {
      const pos = pointsRef.current.geometry.attributes.position.array;
      for (let i = 2000; i < count; i++) {
        const idx = i * 3;
        // Scroll coordinate streams vertically downwards
        pos[idx + 1] -= speeds[i];
        if (pos[idx + 1] < -4) {
          pos[idx + 1] = 4; // recycle back to top
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} colors={colors} stride={3}>
      <PointMaterial
        transparent
        vertexColors
        size={0.055}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function CodeMatrixScene({ mousePos, reducedMotion }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (reducedMotion) return;
    const time = state.clock.getElapsedTime();

    if (groupRef.current) {
      // Gentle floating/rotating grid camera tilt
      groupRef.current.rotation.y = time * 0.03;
      groupRef.current.position.x = mousePos.x * 0.4;
      groupRef.current.position.y = mousePos.y * 0.4;
    }
  });

  return (
    <group ref={groupRef}>
      <MatrixGrid mousePos={mousePos} reducedMotion={reducedMotion} />
    </group>
  );
}

export default function CodeMatrix({ mousePos, reducedMotion }) {
  return (
    <div className="canvas-container">
      <Canvas
        camera={{ position: [0, 0.5, 4.5], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#030014"]} />
        <ambientLight intensity={0.5} />
        <CodeMatrixScene mousePos={mousePos} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
