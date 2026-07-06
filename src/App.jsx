import React, { useState, useEffect, useRef } from 'react';
import CosmosCanvas from './components/CosmosCanvas';
import ContentOverlay from './components/ContentOverlay';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Helper to detect if WebGL is supported by the browser/hardware
function detectWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const [webGLAvailable, setWebGLAvailable] = useState(true);
  const containerRef = useRef(null);

  // 1. Detect WebGL & prefers-reduced-motion media query
  useEffect(() => {
    setWebGLAvailable(detectWebGL());

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(motionQuery.matches);

    const handleMotionChange = (e) => setReducedMotion(e.matches);
    motionQuery.addEventListener('change', handleMotionChange);

    return () => motionQuery.removeEventListener('change', handleMotionChange);
  }, []);

  // 2. Mouse tracking for parallax (only if motion is enabled)
  useEffect(() => {
    if (reducedMotion) return;

    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [reducedMotion]);

  // 3. Scroll Trigger tracking for camera positions
  useEffect(() => {
    const sections = gsap.utils.toArray('section');
    const scrollCount = sections.length;

    // In reduced motion, we directly jump to sections without transition delays
    const scrubTime = reducedMotion ? 0 : 0.5;

    const scrollTrigger = ScrollTrigger.create({
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: scrubTime,
      onUpdate: (self) => {
        const val = self.progress * (scrollCount - 1);
        setScrollProgress(val);
        setActiveSection(Math.min(Math.floor(val + 0.5), scrollCount - 1));
      }
    });

    return () => {
      scrollTrigger.kill();
    };
  }, [reducedMotion]);

  return (
    <div ref={containerRef} className={reducedMotion ? 'reduced-motion-active' : ''}>
      {/* 3D Canvas with WebGL capability fallback */}
      {webGLAvailable ? (
        <CosmosCanvas
          scrollProgress={scrollProgress}
          activeSection={activeSection}
          mousePos={reducedMotion ? { x: 0, y: 0 } : mousePos}
          reducedMotion={reducedMotion}
        />
      ) : (
        // WebGL-unavailable fallback: static starfield background image
        <div className="canvas-container fallback-starfield" aria-hidden="true" />
      )}

      {/* HTML Content Overlay */}
      <ContentOverlay />
    </div>
  );
}
