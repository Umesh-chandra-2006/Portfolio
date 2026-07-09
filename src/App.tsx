import React, { useState, useEffect, useRef } from 'react';
import DimensionRouter from './components/DimensionRouter';
import PortalOverlay from './components/PortalOverlay';
import ContentOverlay from './components/ContentOverlay';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch {
    return false;
  }
}

export default function App(): React.JSX.Element {
  const [activeSection, setActiveSection] = useState(0);
  const [targetSection, setTargetSection] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const [webGLAvailable, setWebGLAvailable] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const targetSectionRef = useRef(0);

  // 1. Detect WebGL support and prefers-reduced-motion
  useEffect(() => {
    setWebGLAvailable(detectWebGL());

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(motionQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    motionQuery.addEventListener('change', handleMotionChange);

    return () => motionQuery.removeEventListener('change', handleMotionChange);
  }, []);

  // 2. Mouse tracking for visual parallax
  useEffect(() => {
    if (reducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [reducedMotion]);

  // 3. Coordinate ScrollTrigger transitions
  useEffect(() => {
    const sections = gsap.utils.toArray('section');
    const scrollCount = sections.length;

    const scrollTrigger = ScrollTrigger.create({
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: reducedMotion ? 0 : 0.5,
      onUpdate: (self) => {
        const progress = self.progress * (scrollCount - 1);
        const nextSec = Math.min(Math.floor(progress + 0.5), scrollCount - 1);

        if (nextSec !== targetSectionRef.current) {
          targetSectionRef.current = nextSec;
          setTargetSection(nextSec);
        }
      }
    });

    return () => {
      scrollTrigger.kill();
    };
  }, [reducedMotion]);

  // Handle Dimension mounts once transition completes
  const handleTransitionMidpoint = (nextSec: number) => {
    setActiveSection(nextSec);
  };

  return (
    <div ref={containerRef} className={reducedMotion ? 'reduced-motion-active' : ''}>
      {/* 3D Cosmos Router Canvas */}
      {webGLAvailable ? (
        <DimensionRouter
          activeSection={activeSection}
          mousePos={reducedMotion ? { x: 0, y: 0 } : mousePos}
          reducedMotion={reducedMotion}
        />
      ) : (
        <div className="canvas-container fallback-starfield" aria-hidden="true" />
      )}

      {/* Iris Portal Overlay Swapper */}
      <PortalOverlay
        targetSection={targetSection}
        reducedMotion={reducedMotion}
        onTransitionMidpoint={handleTransitionMidpoint}
      />

      {/* HTML content sheets */}
      <ContentOverlay />
    </div>
  );
}