import { useEffect, useState } from 'react';

const BOOT_LOGS = [
  'SYSTEM INITIALIZATION...',
  '[OK] Kernel modules compiled',
  '[OK] n8n pipeline nodes mapped',
  '[INFO] Spawning Multi-Agent verifier loop',
  '[INFO] Loading PlaceIQ REST pipeline (65 endpoints)',
  '[INFO] Spawning sandboxed judge executor (Docker)',
  '[OK] AWS EC2/ECR instances operational',
  '[OK] Port 5173 listening for connections',
  '[OK] Orbit matrices aligned',
  '[OK] 35,000 stellar bodies synced to scroll progress',
  '[INFO] Listening on thirumaniumeshchandra2006@gmail.com',
  '[INFO] Connection established from gateway // HYD_IN',
  'SINGULARITY SYSTEM READY.'
];

export default function VoidConsole({ mousePos: _mousePos, reducedMotion }: { mousePos: { x: number; y: number }; reducedMotion: boolean }) {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (reducedMotion) {
      setLogs(BOOT_LOGS);
      return;
    }

    let idx = 0;
    const interval = setInterval(() => {
      if (idx < BOOT_LOGS.length) {
        setLogs((prev) => [...prev, BOOT_LOGS[idx]]);
        idx++;
      } else {
        clearInterval(interval);
      }
    }, 450);

    return () => clearInterval(interval);
  }, [reducedMotion]);

  return (
    <div className="canvas-container terminal-dimension" aria-hidden="true">
      <div className="terminal-scanlines" />
      <div className="terminal-log-panel">
        <div className="terminal-header-line">UMESH_OS v4.12 // TERMINAL STATE</div>
        <div className="terminal-divider" />
        {logs.map((log, i) => (
          <div key={i} className="terminal-log-row">
            <span className="terminal-prompt">{'>'}</span>
            <span className="terminal-text">{log}</span>
          </div>
        ))}
        <div className="terminal-log-row blinking-cursor-row">
          <span className="terminal-prompt">{'>'}</span>
          <span className="terminal-cursor" />
        </div>
      </div>
    </div>
  );
}