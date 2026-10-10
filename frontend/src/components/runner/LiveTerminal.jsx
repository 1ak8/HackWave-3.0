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
        return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 font-mono">HEAL</span>;
      case 'success':
        return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 font-mono">PASS</span>;
      case 'error':
        return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-400/20 text-red-300 border border-red-400/30 font-mono">FAIL</span>;
      case 'warn':
        return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 font-mono">WARN</span>;
      case 'chaos':
        return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-400/20 text-rose-300 border border-rose-400/30 font-mono">CHAOS</span>;
      default:
        return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-400/20 text-sky-300 border border-sky-400/30 font-mono">INFO</span>;
    }
  };

  return (
    <div className="border border-black/[0.08] rounded-3xl bg-[#1c1c1e] text-slate-100 flex flex-col h-full overflow-hidden shadow-apple-elevated font-mono">
      {/* macOS Terminal Title Bar */}
      <div className="bg-[#2c2c2e]/80 px-4 py-3 border-b border-white/[0.06] flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          {/* macOS Traffic Lights */}
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block shadow-sm"></span>
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block shadow-sm"></span>
            <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block shadow-sm"></span>
          </div>
          <span className="text-xs text-slate-300 font-medium ml-2 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-apple-blue" />
            Playwright Telemetry Stream
          </span>
        </div>

        {onClear && (
          <button
            onClick={onClear}
            className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition p-1 rounded hover:bg-white/10"
            title="Clear output"
          >
            <Trash2 className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      {/* Terminal Output Stream */}
      <div className="p-4 overflow-y-auto flex-1 space-y-2 text-xs text-slate-300 leading-relaxed max-h-[380px] min-h-[220px]">
        {logs.length === 0 ? (
          <div className="text-slate-500 text-center py-12 italic">
            Telemetry stream listening... Trigger a test execution to inspect live browser hooks.
          </div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="flex items-start gap-2.5 hover:bg-white/[0.04] p-1 rounded-lg">
              <span className="text-slate-500 text-[11px] select-none shrink-0 font-mono">
                {log.timestamp}
              </span>
              <span className="shrink-0 font-mono">
                {getTagBadge(log.type)}
              </span>
              <span className={`break-all ${
                log.type === 'error' ? 'text-red-300' :
                log.type === 'healing' ? 'text-amber-200' :
                log.type === 'success' ? 'text-emerald-300' : 'text-slate-200'
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
