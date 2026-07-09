import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

function GlassTorusKnot({ mousePos, reducedMotion }: { mousePos: { x: number; y: number }; reducedMotion: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = reducedMotion ? 0 : state.clock.getElapsedTime();

    if (meshRef.current) {
      meshRef.current.rotation.x = time * 0.25;
      meshRef.current.rotation.y = time * 0.15;

      if (!reducedMotion) {
        meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, mousePos.x * 0.8, 0.08);
        meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, mousePos.y * 0.8, 0.08);
      }
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1.3, 0.45, 120, 16]} />
      <MeshTransmissionMaterial
        backside
        backsideThickness={0.2}
        thickness={0.65}
        roughness={0.06}
        transmission={0.95}
        ior={1.25}
        chromaticAberration={0.08}
        anisotropy={0.1}
        distortion={0.15}
        distortionScale={0.3}
        temporalDistortion={0.05}
        clearcoat={1}
        attenuationDistance={0.5}
        attenuationColor="#ffffff"
        color="#c7d2fe"
      />
    </mesh>
  );
}

export default function Singularity({ mousePos, reducedMotion }: { mousePos: { x: number; y: number }; reducedMotion: boolean }) {
  return (
    <div className="canvas-container">
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#030014']} />
        <ambientLight intensity={0.2} />
        <pointLight position={[5, 5, 5]} intensity={2.5} color="#00d4ff" />
        <pointLight position={[-5, -5, -5]} intensity={1.5} color="#7c3aed" />
        <directionalLight position={[0, 5, 0]} intensity={1} color="#ffffff" />
        <GlassTorusKnot mousePos={mousePos} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}