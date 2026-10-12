import React, { useRef, useEffect } from 'react';
import { Terminal, Trash2 } from 'lucide-react';

export default function LiveTerminal({ logs = [], onClear }) {
  const terminalEndRef = useRef(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getTagBadge = (type) => {
    switch (type) {
      case 'healing':
        return <span className="text-2xs font-mono font-medium px-1.5 py-0.2 rounded bg-[#1f6feb]/20 text-[#58a6ff] border border-[#388bfd]/40">HEAL</span>;
      case 'success':
        return <span className="text-2xs font-mono font-medium px-1.5 py-0.2 rounded bg-[#238636]/20 text-[#3fb950] border border-[#2ea043]/40">PASS</span>;
      case 'error':
        return <span className="text-2xs font-mono font-medium px-1.5 py-0.2 rounded bg-[#da3633]/20 text-[#f85149] border border-[#f85149]/40">FAIL</span>;
      case 'warn':
        return <span className="text-2xs font-mono font-medium px-1.5 py-0.2 rounded bg-[#9e6a03]/20 text-[#d29922] border border-[#bb8009]/40">WARN</span>;
      case 'chaos':
        return <span className="text-2xs font-mono font-medium px-1.5 py-0.2 rounded bg-[#b62324]/20 text-[#ff7b72] border border-[#ff7b72]/40">CHAOS</span>;
      default:
        return <span className="text-2xs font-mono font-medium px-1.5 py-0.2 rounded bg-[#30363d]/40 text-[#8b949e] border border-[#30363d]">INFO</span>;
    }
  };

  return (
    <div className="card h-full flex flex-col overflow-hidden bg-[#0d1117] border-[#30363d] text-[#c9d1d9] font-mono shadow-card">
      {/* Title Bar — GitHub Actions Console Header */}
      <div className="bg-[#161b22] px-4 py-2.5 border-b border-[#30363d] flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-[#58a6ff]" />
          <span className="text-xs text-[#e6edf3] font-semibold font-sans">
            Playwright Telemetry Stream
          </span>
          <span className="text-2xs text-[#8b949e] font-mono">({logs.length} logged events)</span>
        </div>

        {onClear && (
          <button
            onClick={onClear}
            className="text-2xs text-[#8b949e] hover:text-[#e6edf3] flex items-center gap-1 transition px-2 py-0.5 rounded hover:bg-[#21262d] font-sans font-medium"
            title="Clear terminal stream"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Terminal Output */}
      <div className="p-3.5 overflow-y-auto flex-1 space-y-1.5 text-xs text-[#8b949e] leading-relaxed max-h-[420px] min-h-[260px] scrollbar-thin">
        {logs.length === 0 ? (
          <div className="text-[#8b949e] text-center py-16 italic font-sans text-xs">
            Telemetry stream listening... Trigger a test execution to watch real-time browser actions.
          </div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="flex items-start gap-2 hover:bg-[#161b22]/70 px-1.5 py-1 rounded font-mono text-2xs sm:text-xs">
              <span className="text-[#6e7681] text-2xs select-none shrink-0 font-mono pt-0.5">
                {log.timestamp}
              </span>
              <span className="shrink-0">
                {getTagBadge(log.type)}
              </span>
              <span className={`break-all ${
                log.type === 'error' ? 'text-[#f85149] font-medium' :
                log.type === 'healing' ? 'text-[#e3b341] font-medium' :
                log.type === 'success' ? 'text-[#3fb950] font-medium' : 'text-[#c9d1d9]'
              }`}>
                {log.message}
              </span>
            </div>
          ))
        )}
        <div ref={terminalEndRef} />
      </div>
    </div>
  );
}
