import React, { useState, useEffect } from 'react';
import { Shield, Cpu, RefreshCw, Moon, Sun, AlertTriangle } from 'lucide-react';

interface HeaderProps {
  onThemeToggle: () => void;
  isLight: boolean;
  onFlickerToggle: () => void;
  isFlickerActive: boolean;
  currentUser: any;
  onAuthToggle: () => void;
  onNavigate: (page: string) => void;
}

export default function Header({
  onThemeToggle,
  isLight,
  onFlickerToggle,
  isFlickerActive,
  currentUser,
  onAuthToggle,
  onNavigate
}: HeaderProps) {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="relative w-full border-b-2 border-magenta-glow bg-cyber-dark px-4 py-3 md:px-6 md:py-4 z-50">
      {/* Visual Glitch Accents */}
      <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-cyan-glow via-magenta-glow to-cyan-glow animate-pulse"></div>
      
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Brand/Title */}
        <div className="flex items-center gap-3">
          <div className="relative p-2 bg-cyber-black border-2 border-cyan-glow cyber-clip-corners">
            <Cpu className="h-6 w-6 text-cyan-glow animate-pulse" />
            <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-magenta-glow animate-ping"></div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <h1 
                onClick={() => onNavigate('landing')}
                className="text-2xl font-black tracking-wider text-cyan-glow text-glitch-cyan font-pixel cursor-pointer select-none"
                data-text="AI PLACEMENT COPILOT"
              >
                AI PLACEMENT COPILOT
              </h1>
              <span className="text-[10px] font-mono px-1 py-0.5 bg-magenta-glow text-white font-bold rounded">v3.01_HACK</span>
            </div>
            <p className="text-[11px] font-mono text-gray-400 tracking-tight flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-matrix-green animate-pulse"></span>
              [COGNITIVE NETWORK: ONLINE] // SYSTEM_READY
            </p>
          </div>
        </div>

        {/* Live Telemetry Data (Retro Vibe) */}
        <div className="hidden lg:flex items-center gap-4 font-mono text-xs border border-cyan-glow/20 bg-cyber-black/60 px-3 py-1.5 rounded">
          <div className="text-gray-400">
            <div>TARGET_GRID: <span className="text-magenta-glow font-bold">HACKHAZARDS_26</span></div>
            <div>COGNITIVE_CORE: <span className="text-cyan-glow font-bold">ACTIVE</span></div>
          </div>
          <div className="h-6 w-[1px] bg-cyan-glow/30"></div>
          <div className="text-right text-gray-500">
            <div>LOC_TIME: <span className="text-matrix-green font-bold">{currentTime || '2026-07-01'}</span></div>
            <div>SIGNAL: <span className="text-cyan-glow font-bold">100%_SECURE</span></div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 font-mono">
          {/* Machine Flicker Toggle */}
          <button
            onClick={onFlickerToggle}
            title="Toggle Retro Screen Flicker Simulator"
            className={`flex items-center gap-1 text-[11px] px-2 py-1 border-2 transition-all ${
              isFlickerActive 
                ? 'border-magenta-glow text-magenta-glow bg-magenta-glow/10' 
                : 'border-gray-600 text-gray-400 bg-transparent hover:border-cyan-glow hover:text-cyan-glow'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>FLICKER_{isFlickerActive ? 'ON' : 'OFF'}</span>
          </button>

          {/* Theme Toggler */}
          <button
            onClick={onThemeToggle}
            title="Toggle theme: Cyberpunk Dark / Cyberpunk Light"
            className="p-1.5 border-2 border-cyan-glow text-cyan-glow bg-transparent hover:bg-cyan-glow/10 transition-colors"
          >
            {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>

          {/* Authentication State Button */}
          {currentUser ? (
            <div className="flex items-center gap-2 pl-1">
              <span className="hidden sm:inline-block text-xs font-mono text-gray-300">
                [UID: <span className="text-cyan-glow">{currentUser.name}</span>]
              </span>
              <button
                onClick={onAuthToggle}
                className="text-xs px-3 py-1.5 bg-magenta-glow text-white font-bold hover:bg-magenta-glow/80 transition-colors cyber-clip-corners"
              >
                DISCONNECT_
              </button>
            </div>
          ) : (
            <button
              onClick={() => onNavigate('auth')}
              className="text-xs px-3 py-1.5 border-2 border-matrix-green text-matrix-green font-bold hover:bg-matrix-green/10 transition-colors cyber-clip-corners"
            >
              INITIALIZE_LOG_IN
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
