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
        return <span className="text-2xs font-bold px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 font-mono">HEAL</span>;
      case 'success':
        return <span className="text-2xs font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">PASS</span>;
      case 'error':
        return <span className="text-2xs font-bold px-1.5 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 font-mono">FAIL</span>;
      case 'warn':
        return <span className="text-2xs font-bold px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 font-mono">WARN</span>;
      case 'chaos':
        return <span className="text-2xs font-bold px-1.5 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 font-mono">CHAOS</span>;
      default:
        return <span className="text-2xs font-bold px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800 font-mono">INFO</span>;
    }
  };

  return (
    <div className="card h-full flex flex-col overflow-hidden bg-gray-950 border-gray-800 text-gray-200 font-mono shadow-sm">
      {/* Title Bar */}
      <div className="bg-gray-900/90 px-4 py-2.5 border-b border-gray-800 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-xs text-gray-300 font-semibold font-sans">
            Playwright Execution Telemetry
          </span>
          <span className="text-2xs text-gray-500 font-mono">({logs.length} events)</span>
        </div>

        {onClear && (
          <button
            onClick={onClear}
            className="text-2xs text-gray-400 hover:text-white flex items-center gap-1 transition px-2 py-0.5 rounded hover:bg-gray-800"
            title="Clear terminal stream"
          >
            <Trash2 className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      {/* Terminal Output */}
      <div className="p-3.5 overflow-y-auto flex-1 space-y-1.5 text-xs text-gray-300 leading-relaxed max-h-[380px] min-h-[220px] scrollbar-thin">
        {logs.length === 0 ? (
          <div className="text-gray-600 text-center py-12 italic font-sans text-xs">
            Telemetry stream listening... Trigger a test execution to watch real-time browser actions.
          </div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="flex items-start gap-2 hover:bg-gray-900/60 p-1 rounded font-mono text-xs">
              <span className="text-gray-500 text-2xs select-none shrink-0 font-mono pt-0.5">
                {log.timestamp}
              </span>
              <span className="shrink-0">
                {getTagBadge(log.type)}
              </span>
              <span className={`break-all ${
                log.type === 'error' ? 'text-red-400' :
                log.type === 'healing' ? 'text-amber-300' :
                log.type === 'success' ? 'text-emerald-400' : 'text-gray-200'
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
