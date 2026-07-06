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

  // 1. Mouse Move tracking for Parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      // Normalize between -1 and 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 2. GSAP ScrollTrigger tracking
  useEffect(() => {
    const sections = gsap.utils.toArray('section');
    const scrollCount = sections.length;

    // Fade in text overlay cards on entrance
    sections.forEach((section, i) => {
      const panel = section.querySelector('.glass-panel');
      if (!panel) return;

      gsap.fromTo(panel, 
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    // Track overall scroll progress for 3D camera travel
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        onUpdate: (self) => {
          // self.progress goes from 0 to 1.
          // Map to 0 -> (scrollCount - 1)
          const value = self.progress * (scrollCount - 1);
          setScrollProgress(value);
          
          const activeIndex = Math.min(Math.floor(value + 0.5), scrollCount - 1);
          setActiveSection(activeIndex);
        }
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div ref={containerRef}>
      {/* 3D Canvas Background */}
      <CosmosCanvas
        scrollProgress={scrollProgress}
        activeSection={activeSection}
        mousePos={mousePos}
      />

      {/* HTML Overlay */}
      <ContentOverlay />
    </div>
  );
}
