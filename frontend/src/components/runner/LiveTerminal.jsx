import React, { useRef, useEffect } from 'react';
import { Terminal, Trash2, Shield, Flame, Zap } from 'lucide-react';

export default function LiveTerminal({ logs = [], onClear }) {
  const terminalEndRef = useRef(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getTagBadge = (type) => {
    switch (type) {
      case 'healing':
        return <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">HEAL</span>;
      case 'success':
        return <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">PASS</span>;
      case 'error':
        return <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-red-500/20 text-red-300 border border-red-500/30">FAIL</span>;
      case 'warn':
        return <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">WARN</span>;
      case 'chaos':
        return <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-crimson-500/20 text-crimson-300 border border-crimson-500/30">CHAOS</span>;
      default:
        return <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">INFO</span>;
    }
  };

  return (
    <div className="border border-white/10 rounded-2xl bg-obsidian-950 flex flex-col h-full overflow-hidden shadow-2xl font-mono">
      {/* Terminal Title Bar */}
      <div className="bg-obsidian-900 px-4 py-2.5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
          </div>
          <span className="text-xs text-slate-300 font-semibold ml-2 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            Live Playwright & AI Telemetry Console
          </span>
        </div>

        {onClear && (
          <button
            onClick={onClear}
            className="text-[11px] text-slate-500 hover:text-slate-300 flex items-center gap-1 transition"
            title="Clear output"
          >
            <Trash2 className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      {/* Terminal Output Area */}
      <div className="p-4 overflow-y-auto flex-1 space-y-2 text-xs text-slate-300 leading-relaxed max-h-[380px] min-h-[220px]">
        {logs.length === 0 ? (
          <div className="text-slate-600 text-center py-12 italic">
            Telemetry stream listening... Trigger a test execution to inspect live browser hooks.
          </div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="flex items-start gap-2.5 hover:bg-white/[0.02] p-1 rounded">
              <span className="text-slate-500 text-[11px] select-none shrink-0 font-mono">
                {log.timestamp}
              </span>
              <span className="shrink-0 font-mono">
                {getTagBadge(log.type)}
              </span>
              <span className={`break-all ${
                log.type === 'error' ? 'text-red-300' :
                log.type === 'healing' ? 'text-amber-200' :
                log.type === 'success' ? 'text-emerald-300' : 'text-slate-300'
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
