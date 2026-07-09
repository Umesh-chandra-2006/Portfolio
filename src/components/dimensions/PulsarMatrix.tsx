import { useEffect, useRef } from 'react';

export default function PulsarMatrix({ mousePos: _mousePos, reducedMotion }: { mousePos: { x: number; y: number }; reducedMotion: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    let angle = 0;
    const rings = [
      { r: 40, maxR: 120, speed: 1.0 },
      { r: 80, maxR: 200, speed: 0.8 },
      { r: 120, maxR: 280, speed: 0.6 }
    ];

    const draw = () => {
      ctx.fillStyle = '#030014';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      ctx.strokeStyle = 'rgba(251, 191, 36, 0.04)';
      ctx.lineWidth = 1;

      for (let r = 50; r <= 300; r += 50) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.moveTo(cx - 320, cy);
      ctx.lineTo(cx + 320, cy);
      ctx.moveTo(cx, cy - 320);
      ctx.lineTo(cx, cy + 320);
      ctx.stroke();

      if (!reducedMotion) {
        rings.forEach((ring) => {
          ring.r += ring.speed;
          if (ring.r > ring.maxR) {
            ring.r = 30;
          }
          const alpha = 1.0 - (ring.r / ring.maxR);
          ctx.strokeStyle = `rgba(251, 191, 36, ${alpha * 0.25})`;
          ctx.beginPath();
          ctx.arc(cx, cy, ring.r, 0, Math.PI * 2);
          ctx.stroke();
        });
      } else {
        ctx.beginPath();
        ctx.arc(cx, cy, 100, 0, Math.PI * 2);
        ctx.arc(cx, cy, 180, 0, Math.PI * 2);
        ctx.stroke();
      }

      if (!reducedMotion) {
        angle += 0.015;
      }
      const sweepX = cx + Math.cos(angle) * 300;
      const sweepY = cy + Math.sin(angle) * 300;

      ctx.strokeStyle = 'rgba(251, 191, 36, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(sweepX, sweepY);
      ctx.stroke();

      ctx.fillStyle = 'rgba(251, 191, 36, 0.4)';
      ctx.font = '9px monospace';
      ctx.fillText(`AZIMUTH: ${(angle * (180 / Math.PI) % 360).toFixed(1)}\u00B0`, cx - 300, cy - 310);
      ctx.fillText('PULSAR MATRIX RADAR // VERIFIED SIGNAL', cx - 300, cy - 295);

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [reducedMotion]);

  return (
    <div className="canvas-container">
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}