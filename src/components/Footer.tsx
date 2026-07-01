import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full border-t-2 border-cyan-glow bg-cyber-black py-6 px-4 md:px-6 font-mono text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-cyan-glow text-glitch-cyan font-pixel text-lg">
            [HACKHAZARDS '26 – AI PLACEMENT COPILOT]
          </p>
          <p className="text-gray-400 mt-1">
            Built by Cybernetic Architects. Optimized for standard terminal deployment.
          </p>
        </div>

        <div className="text-gray-500 text-[11px] md:text-right">
          <div>CONSOLE_STATE: SECURED</div>
          <div>TRANSMISSION_PROTOCOL: SSL_TLS_AES_256</div>
          <div>© {new Date().getFullYear()} NEUROGRID SYSTEMS. ALL VIRTUAL RIGHTS PERSISTED.</div>
        </div>
      </div>
    </footer>
  );
}
