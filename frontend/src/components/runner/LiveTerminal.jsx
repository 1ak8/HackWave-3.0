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
        return <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 font-mono">HEAL</span>;
      case 'success':
        return <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">PASS</span>;
      case 'error':
        return <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 font-mono">FAIL</span>;
      case 'warn':
        return <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 font-mono">WARN</span>;
      case 'chaos':
        return <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 font-mono">CHAOS</span>;
      default:
        return <span className="text-xs font-bold px-2 py-0.5 rounded bg-stone-900 text-emerald-400 border border-stone-800 font-mono">INFO</span>;
    }
  };

  return (
    <div className="card h-full flex flex-col overflow-hidden bg-gray-950 border-gray-800 text-gray-200 font-mono shadow-card">
      {/* Title Bar */}
      <div className="bg-gray-900/90 px-5 py-3 border-b border-gray-800 flex items-center justify-between select-none">
        <div className="flex items-center gap-2.5">
          <Terminal className="w-4 h-4 text-brand" />
          <span className="text-sm text-gray-200 font-bold font-sans">
            Playwright Telemetry Stream
          </span>
          <span className="text-xs text-ink-tertiary font-mono">({logs.length} logged events)</span>
        </div>

        {onClear && (
          <button
            onClick={onClear}
            className="text-xs text-ink-tertiary hover:text-white flex items-center gap-1.5 transition px-2.5 py-1 rounded hover:bg-gray-800 font-sans font-medium"
            title="Clear terminal stream"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Terminal Output */}
      <div className="p-4 overflow-y-auto flex-1 space-y-2 text-sm text-ink-secondary leading-relaxed max-h-[420px] min-h-[260px] scrollbar-thin">
        {logs.length === 0 ? (
          <div className="text-ink-tertiary text-center py-16 italic font-sans text-sm">
            Telemetry stream listening... Trigger a test execution to watch real-time browser actions.
          </div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="flex items-start gap-2.5 hover:bg-gray-900/60 p-1.5 rounded font-mono text-sm">
              <span className="text-ink-tertiary text-xs select-none shrink-0 font-mono pt-0.5">
                {log.timestamp}
              </span>
              <span className="shrink-0">
                {getTagBadge(log.type)}
              </span>
              <span className={`break-all ${
                log.type === 'error' ? 'text-red-400 font-semibold' :
                log.type === 'healing' ? 'text-amber-300 font-semibold' :
                log.type === 'success' ? 'text-emerald-400 font-semibold' : 'text-gray-200'
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
