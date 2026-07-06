import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import CelestialBodies from './CelestialBodies';

export default function CosmosCanvas({ scrollProgress, activeSection, mousePos }) {
  return (
    <div className="canvas-container">
      <Canvas
        camera={{ position: [0, 5, 10], fov: 60, near: 0.1, far: 200 }}
        dpr={[1, 2]}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: "high-performance"
        }}
      >
        <color attach="background" args={["#030014"]} />
        <ambientLight intensity={0.6} />
        
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
