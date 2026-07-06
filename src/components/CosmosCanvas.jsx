import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import CelestialBodies from './CelestialBodies';

export default function CosmosCanvas({ scrollProgress, activeSection, mousePos }) {
  return (
    <div className="canvas-container">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60, near: 0.1, far: 100 }}
        dpr={[1, 2]}
        gl={{
          antialias: false, // Turn off for speed on low-end GPUs
          alpha: false,
          powerPreference: "high-performance"
        }}
      >
        <color attach="background" args={["#030014"]} />
        <ambientLight intensity={0.5} />
        
        <Suspense fallback={null}>
          <CelestialBodies
            scrollProgress={scrollProgress}
            activeSection={activeSection}
            mousePos={mousePos}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
