import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight, 
  Code2, 
  Cpu, 
  CheckCircle,
  XCircle,
  FileDiff
} from 'lucide-react';

export default function DiffInspector({ selectedStep }) {
  if (!selectedStep) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center border border-white/10 rounded-2xl bg-obsidian-900/60">
        <FileDiff className="w-10 h-10 text-slate-600 mb-3" />
        <h4 className="text-sm font-semibold text-slate-300">No Step Selected</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-xs">
          Click any step in the Intent Graph above to inspect its DOM selectors, healing rationale, and confidence scores.
        </p>
      </div>
    );
  }

  const healing = selectedStep.healingDetails || {};
  const isHealed = selectedStep.status === 'healed' || healing.wasHealed;
  const isBug = selectedStep.status === 'failed' || healing.classification === 'Genuine_Bug';
  const confidence = healing.confidence || 0;

  return (
    <div className="border border-white/10 rounded-2xl bg-obsidian-900/80 p-5 backdrop-blur-md shadow-xl flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-emerald-400" />
          <h4 className="text-sm font-bold text-white tracking-wide">
            Step Inspector: #{selectedStep.order} — {selectedStep.name}
          </h4>
        </div>
        <div className="flex items-center gap-2">
          {isHealed && (
            <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Harmless UI Mutation (Auto-Healed)
            </span>
          )}
          {isBug && (
            <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-300 border border-red-500/30 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              Genuine Bug Triaged (Halted)
            </span>
          )}
          {!isHealed && !isBug && (
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10">
              Clean Execution
            </span>
          )}
        </div>
      </div>

      {/* Target User Intent */}
      <div className="bg-obsidian-950 p-3.5 rounded-xl border border-white/5">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
          Target User Intent
        </span>
        <p className="text-xs text-white font-medium">"{selectedStep.intent}"</p>
      </div>

      {/* Before / After Selector Diff Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Original Broken Selector */}
        <div className="bg-obsidian-950 p-3.5 rounded-xl border border-red-500/20 relative overflow-hidden">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-red-400 flex items-center gap-1">
              <XCircle className="w-3 h-3" /> Original Selector (Broken)
            </span>
            <span className="text-[10px] font-mono text-red-400/60">Target V1</span>
          </div>
          <code className="text-xs font-mono text-red-300 break-all bg-red-950/30 p-2 rounded block border border-red-500/10">
            {selectedStep.originalSelector}
          </code>
        </div>

        {/* Healed Dynamic Selector */}
        <div className="bg-obsidian-950 p-3.5 rounded-xl border border-emerald-500/20 relative overflow-hidden">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Healed Dynamic Selector
            </span>
            <span className="text-[10px] font-mono text-emerald-400/60">Autonomous AI V2</span>
          </div>
          <code className="text-xs font-mono text-emerald-300 break-all bg-emerald-950/30 p-2 rounded block border border-emerald-500/10">
            {selectedStep.resolvedSelector || (isBug ? 'NONE (HALTED TO PREVENT FALSE PASS)' : selectedStep.originalSelector)}
          </code>
        </div>
      </div>

      {/* Confidence Score Bar */}
      {isHealed && (
        <div className="bg-obsidian-950 p-3.5 rounded-xl border border-white/5">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-400 font-mono text-[11px]">AI Confidence Rating:</span>
            <span className="font-mono font-bold text-emerald-400">{confidence}% Confidence Match</span>
          </div>
          <div className="w-full h-2 rounded-full bg-obsidian-800 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full transition-all duration-1000"
              style={{ width: `${confidence}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* AI Explanation & Triage Reasoning (Natural Language PM-Friendly) */}
      <div className="bg-obsidian-850 p-4 rounded-xl border border-white/10">
        <div className="flex items-center gap-1.5 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Autonomous Reasoning Log
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          {healing.reasoning || selectedStep.error || 'This step completed using its baseline DOM selector without requiring dynamic intervention.'}
        </p>
      </div>
    </div>
  );
}
