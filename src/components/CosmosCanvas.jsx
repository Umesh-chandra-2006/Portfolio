import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import CelestialBodies from './CelestialBodies';

export default function CosmosCanvas({ scrollProgress, activeSection, mousePos, reducedMotion }) {
  return (
    <div className="canvas-container">
      <Canvas
        camera={{ position: [0, 2, 8], fov: 65, near: 0.1, far: 200 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: "high-performance",
          toneMapping: 3 // ACESFilmic
        }}
      >
        <color attach="background" args={["#030014"]} />

        <Suspense fallback={null}>
          <CelestialBodies
            scrollProgress={scrollProgress}
            activeSection={activeSection}
            mousePos={mousePos}
            reducedMotion={reducedMotion}
          />
        </Suspense>

        {/* Postprocessing Bloom */}
        <EffectComposer>
          <Bloom
            intensity={1.8}
            luminanceThreshold={0.15}
            luminanceSmoothing={0.9}
            mipmapBlur={true}
            radius={0.85}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
