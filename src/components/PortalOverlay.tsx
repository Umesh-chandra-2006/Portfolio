import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface PortalOverlayProps {
  targetSection: number;
  reducedMotion: boolean;
  onTransitionMidpoint: (section: number) => void;
}

export default function PortalOverlay({ targetSection, reducedMotion, onTransitionMidpoint }: PortalOverlayProps): React.JSX.Element | null {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const currentTargetRef = useRef(targetSection);
  const midTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const endTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Skip if targetSection hasn't actually changed
    if (targetSection === currentTargetRef.current) return;

    currentTargetRef.current = targetSection;

    if (reducedMotion) {
      // Direct jump for prefers-reduced-motion
      onTransitionMidpoint(targetSection);
      return;
    }

    // Cancel any ongoing timers to support instant interruption during rapid scroll
    if (midTimerRef.current) clearTimeout(midTimerRef.current);
    if (endTimerRef.current) clearTimeout(endTimerRef.current);

    setIsTransitioning(true);

    // Swap dimensions exactly at the 300ms midpoint of the transition
    midTimerRef.current = setTimeout(() => {
      onTransitionMidpoint(targetSection);
    }, 300);

    // End transition at 600ms
    endTimerRef.current = setTimeout(() => {
      setIsTransitioning(false);
    }, 600);

    return () => {
      if (midTimerRef.current) clearTimeout(midTimerRef.current);
      if (endTimerRef.current) clearTimeout(endTimerRef.current);
    };
  }, [targetSection, reducedMotion, onTransitionMidpoint]);

  if (reducedMotion || !isTransitioning) return null;

  return (
    <div style={{ pointerEvents: 'none', position: 'fixed', inset: 0, zIndex: 100 }}>
      {/*
        Keyed to targetSection to force React to mount a fresh element
        and restart the keyframe animations on every section swap
      */}
      <motion.div
        key={targetSection}
        initial={{ clipPath: 'circle(0% at 50% 50%)' }}
        animate={{
          clipPath: [
            'circle(0% at 50% 50%)',
            'circle(150% at 50% 50%)',
            'circle(0% at 50% 50%)'
          ]
        }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          inset: 0,
          background: '#030014',
          boxShadow: 'inset 0 0 100px rgba(124, 58, 237, 0.4)'
        }}
      />

      {/* Chromatic aberration RGB split flash */}
      <motion.div
        key={`aberration-${targetSection}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.8, 0] }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle, transparent 30%, rgba(0, 212, 255, 0.15) 100%)',
          mixBlendMode: 'screen'
        }}
      />
    </div>
  );
}