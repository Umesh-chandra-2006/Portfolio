import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

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

const NebulaShaderMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uTexture: { value: null }
  },
  vertexShader: `
    uniform float uTime;
    attribute vec3 aVelocity;
    varying vec3 vColor;
    void main() {
      vColor = color;
      
      // Calculate dynamic drift on GPU using sine wave offsets
      vec3 waveOffset = sin(uTime * 0.35 + position) * aVelocity * 1.2;
      vec3 finalPos = position + waveOffset;
      
      vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      
      // Dynamic size attenuation
      gl_PointSize = (48.0 / -mvPosition.z);
    }
  `,
  fragmentShader: `
    uniform sampler2D uTexture;
    varying vec3 vColor;
    void main() {
      vec4 tex = texture2D(uTexture, gl_PointCoord);
      if (tex.a < 0.01) discard;
      gl_FragColor = vec4(vColor, tex.a * 0.45);
    }
  `
};

function VolumetricClouds({ mousePos, reducedMotion }) {
  const materialRef = useRef();
  const pointsRef = useRef();
  const glowTex = useMemo(() => createGlowTexture(), []);

  const count = 18000;

  const nebulaData = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const vels = new Float32Array(count * 3);

    const magenta = new THREE.Color("#a855f7");
    const purple = new THREE.Color("#7c3aed");
    const cyan = new THREE.Color("#00d4ff");

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      
      // Form a dense circular gas lane in front of the camera
      const theta = Math.random() * Math.PI * 2;
      const radius = 1.0 + Math.pow(Math.random(), 2) * 5.0;
      
      pos[idx] = Math.cos(theta) * radius;
      pos[idx + 1] = Math.sin(theta) * radius * 0.8 + (Math.random() - 0.5) * 1.5;
      pos[idx + 2] = (Math.random() - 0.5) * 6; // depth corridor

      const c = i % 3 === 0 ? magenta : (i % 3 === 1 ? purple : cyan);
      cols[idx] = c.r;
      cols[idx + 1] = c.g;
      cols[idx + 2] = c.b;

      vels[idx] = (Math.random() - 0.5) * 0.2;
      vels[idx + 1] = (Math.random() - 0.5) * 0.2;
      vels[idx + 2] = (Math.random() - 0.5) * 0.2;
    }
    return { pos, cols, vels };
  }, []);

  useFrame((state) => {
    const time = reducedMotion ? 0 : state.clock.getElapsedTime();
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = time;
    }

    if (pointsRef.current && !reducedMotion) {
      pointsRef.current.rotation.z = time * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[nebulaData.pos, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[nebulaData.cols, 3]}
        />
        <bufferAttribute
          attach="attributes-aVelocity"
          args={[nebulaData.vels, 3]}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        args={[NebulaShaderMaterial]}
        uniforms-uTexture-value={glowTex}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function GenerativeNebula({ mousePos, reducedMotion }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (reducedMotion) return;
    if (groupRef.current) {
      groupRef.current.position.x = mousePos.x * 0.5;
      groupRef.current.position.y = mousePos.y * 0.5;
    }
  });

  return (
    <div className="canvas-container">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#030014"]} />
        <ambientLight intensity={0.5} />
        <group ref={groupRef}>
          <VolumetricClouds mousePos={mousePos} reducedMotion={reducedMotion} />
        </group>
      </Canvas>
    </div>
  );
}
