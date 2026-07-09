import React, { Suspense, lazy } from 'react';

// Lazy load heavy dimensions to save initial load assets
const Singularity = lazy(() => import('./dimensions/Singularity'));
const CodeMatrix = lazy(() => import('./dimensions/CodeMatrix'));
const GenerativeNebula = lazy(() => import('./dimensions/GenerativeNebula'));
const VectorField = lazy(() => import('./dimensions/VectorField'));
const PulsarMatrix = lazy(() => import('./dimensions/PulsarMatrix'));
const VoidConsole = lazy(() => import('./dimensions/VoidConsole'));

interface DimensionRouterProps {
  activeSection: number;
  mousePos: { x: number; y: number };
  reducedMotion: boolean;
}

export default function DimensionRouter({ activeSection, mousePos, reducedMotion }: DimensionRouterProps): React.JSX.Element {
  const renderDimension = () => {
    switch (activeSection) {
      case 0:
        return <Singularity mousePos={mousePos} reducedMotion={reducedMotion} />;
      case 1:
        return <CodeMatrix mousePos={mousePos} reducedMotion={reducedMotion} />;
      case 2:
        return <GenerativeNebula mousePos={mousePos} reducedMotion={reducedMotion} />;
      case 3:
        return <VectorField mousePos={mousePos} reducedMotion={reducedMotion} />;
      case 4:
        return <PulsarMatrix mousePos={mousePos} reducedMotion={reducedMotion} />;
      case 5:
        return <VoidConsole mousePos={mousePos} reducedMotion={reducedMotion} />;
      default:
        return null;
    }
  };

  return (
    <Suspense fallback={
      <div className="canvas-container" style={{ background: '#030014' }} />
    }>
      {renderDimension()}
    </Suspense>
  );
}