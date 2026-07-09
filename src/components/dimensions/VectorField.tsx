import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function VectorGrid({ mousePos, reducedMotion }: { mousePos: { x: number; y: number }; reducedMotion: boolean }) {
  const lineSegmentsRef = useRef<THREE.LineSegments>(null);
  const nodesRef = useRef<THREE.Points>(null);

  const nodeCount = 120;

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(nodeCount * 3);
    const vels = new Float32Array(nodeCount * 3);
    for (let i = 0; i < nodeCount; i++) {
      const idx = i * 3;
      pos[idx] = (Math.random() - 0.5) * 6;
      pos[idx + 1] = (Math.random() - 0.5) * 6;
      pos[idx + 2] = (Math.random() - 0.5) * 6;
      vels[idx] = (Math.random() - 0.5) * 0.01;
      vels[idx + 1] = (Math.random() - 0.5) * 0.01;
      vels[idx + 2] = (Math.random() - 0.5) * 0.01;
    }
    return [pos, vels];
  }, []);

  useFrame((_state) => {
    if (reducedMotion) return;
    if (!nodesRef.current) return;

    const nodeGeometry = nodesRef.current.geometry;
    const nodePos = nodeGeometry.attributes.position.array;

    for (let i = 0; i < nodeCount; i++) {
      const idx = i * 3;
      nodePos[idx] += velocities[idx];
      nodePos[idx + 1] += velocities[idx + 1];
      nodePos[idx + 2] += velocities[idx + 2];

      if (Math.abs(nodePos[idx]) > 3) velocities[idx] *= -1;
      if (Math.abs(nodePos[idx + 1]) > 3) velocities[idx + 1] *= -1;
      if (Math.abs(nodePos[idx + 2]) > 3) velocities[idx + 2] *= -1;
    }
    nodeGeometry.attributes.position.needsUpdate = true;

    if (lineSegmentsRef.current) {
      const lineGeometry = lineSegmentsRef.current.geometry;
      const linePositions: number[] = [];

      for (let i = 0; i < nodeCount; i++) {
        const idxA = i * 3;
        const xA = nodePos[idxA];
        const yA = nodePos[idxA + 1];
        const zA = nodePos[idxA + 2];

        for (let j = i + 1; j < nodeCount; j++) {
          const idxB = j * 3;
          const xB = nodePos[idxB];
          const yB = nodePos[idxB + 1];
          const zB = nodePos[idxB + 2];

          const dx = xA - xB;
          const dy = yA - yB;
          const dz = zA - zB;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < 1.1) {
            linePositions.push(xA, yA, zA);
            linePositions.push(xB, yB, zB);
          }
        }

        const cursorX = mousePos.x * 2.5;
        const cursorY = mousePos.y * 2.5;
        const cursorZ = 0;

        const cx = xA - cursorX;
        const cy = yA - cursorY;
        const cz = zA - cursorZ;
        const cursorDist = Math.sqrt(cx * cx + cy * cy + cz * cz);

        if (cursorDist < 1.4) {
          linePositions.push(xA, yA, zA);
          linePositions.push(cursorX, cursorY, cursorZ);
        }
      }

      lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
      lineGeometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      <points ref={nodesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#00d4ff" size={0.06} transparent opacity={0.8} />
      </points>
      <lineSegments ref={lineSegmentsRef}>
        <bufferGeometry />
        <lineBasicMaterial color="#00d4ff" transparent opacity={0.16} />
      </lineSegments>
    </group>
  );
}

export default function VectorField({ mousePos, reducedMotion }: { mousePos: { x: number; y: number }; reducedMotion: boolean }) {
  return (
    <div className="canvas-container">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#030014']} />
        <ambientLight intensity={0.5} />
        <VectorGrid mousePos={mousePos} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}