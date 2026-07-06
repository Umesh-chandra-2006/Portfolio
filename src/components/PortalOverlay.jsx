import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PortalOverlay({ targetSection, reducedMotion, onTransitionMidpoint }) {
  const [transitioning, setTransitioning] = useState(false);
  const [visibleSection, setVisibleSection] = useState(targetSection);
  const currentTarget = useRef(targetSection);

  useEffect(() => {
    if (targetSection === currentTarget.current) return;
    currentTarget.current = targetSection;

    if (reducedMotion) {
      // In reduced motion mode: skip warp/collapsing animations, execute immediate swap
      onTransitionMidpoint(targetSection);
      setVisibleSection(targetSection);
      return;
    }

    // Trigger full portal transition
    setTransitioning(true);

    // Midpoint: Outgoing unmounts, incoming mounts (Exactly 300ms)
    const midTimer = setTimeout(() => {
      onTransitionMidpoint(targetSection);
      setVisibleSection(targetSection);
    }, 300);

    // End: Transition complete (600ms total)
    const endTimer = setTimeout(() => {
      setTransitioning(false);
    }, 600);

    return () => {
      clearTimeout(midTimer);
      clearTimeout(endTimer);
    };
  }, [targetSection, reducedMotion, onTransitionMidpoint]);

  if (reducedMotion) return null;

  return (
    <div style={{ pointerEvents: 'none', position: 'fixed', inset: 0, zIndex: 100 }}>
      <AnimatePresence>
        {transitioning && (
          <>
            {/* Chromatic Aberration RGB split flash */}
            <motion.div
              className="portal-chromatic-split"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.8, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle, transparent 30%, rgba(0, 212, 255, 0.15) 100%)',
                mixBlendMode: 'screen'
              }}
            />

            {/* SVG Iris Clip-Path Portal Curtain */}
            <motion.div
              initial={{ clipPath: 'circle(150% at 50% 50%)' }}
              animate={{ 
                clipPath: [
                  'circle(150% at 50% 50%)', 
                  'circle(0% at 50% 50%)', 
                  'circle(150% at 50% 50%)'
                ] 
              }}
              exit={{ clipPath: 'circle(150% at 50% 50%)' }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              style={{
                position: 'absolute',
                inset: 0,
                background: '#030014',
                boxShadow: 'inset 0 0 100px rgba(124, 58, 237, 0.4)'
              }}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
