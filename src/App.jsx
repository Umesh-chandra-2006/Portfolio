import React, { useState, useEffect, useRef } from 'react';
import CosmosCanvas from './components/CosmosCanvas';
import ContentOverlay from './components/ContentOverlay';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // 1. Mouse coordinates listener for parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 2. Scroll updates tracker driving 3D camera flight coordinates
  useEffect(() => {
    const sections = gsap.utils.toArray('section');
    const scrollCount = sections.length;

    const scrollTrigger = ScrollTrigger.create({
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
      onUpdate: (self) => {
        const val = self.progress * (scrollCount - 1);
        setScrollProgress(val);
        setActiveSection(Math.min(Math.floor(val + 0.5), scrollCount - 1));
      }
    });

    return () => {
      scrollTrigger.kill();
    };
  }, []);

  return (
    <div ref={containerRef}>
      {/* Volumetric Cosmic Canvas */}
      <CosmosCanvas
        scrollProgress={scrollProgress}
        activeSection={activeSection}
        mousePos={mousePos}
      />

      {/* Premium Framer Motion HTML UI overlay */}
      <ContentOverlay />
    </div>
  );
}
