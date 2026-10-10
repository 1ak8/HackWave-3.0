import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Cpu, 
  FileDiff 
} from 'lucide-react';

export default function DiffInspector({ selectedStep }) {
  if (!selectedStep) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center border border-black/[0.06] rounded-3xl bg-white/60 shadow-apple-sm">
        <FileDiff className="w-10 h-10 text-apple-secondary/50 mb-3" />
        <h4 className="text-sm font-bold text-apple-text">No Step Selected</h4>
        <p className="text-xs text-apple-secondary mt-1 max-w-xs">
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
    <div className="border border-black/[0.06] rounded-3xl bg-white/80 backdrop-blur-2xl p-6 shadow-apple-card flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-black/[0.04]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-apple-blue/10 flex items-center justify-center text-apple-blue">
            <Cpu className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-apple-text tracking-tight">
            Step #{selectedStep.order} — {selectedStep.name}
          </h4>
        </div>
        <div>
          {isHealed && (
            <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-apple-green-light text-apple-green border border-apple-green/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Harmless Mutation (Auto-Healed)
            </span>
          )}
          {isBug && (
            <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-apple-red-light text-apple-red border border-apple-red/30 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              Genuine Bug Triaged (Halted)
            </span>
          )}
          {!isHealed && !isBug && (
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-black/[0.04] text-apple-secondary">
              Clean Execution
            </span>
          )}
        </div>
      </div>

      {/* Target User Intent */}
      <div className="bg-black/[0.02] p-3.5 rounded-2xl border border-black/[0.04]">
        <span className="text-[10px] font-mono uppercase tracking-wider text-apple-tertiary block mb-1 font-semibold">
          Target User Intent
        </span>
        <p className="text-xs text-apple-text font-medium leading-relaxed">"{selectedStep.intent}"</p>
      </div>

      {/* Before / After Selector Diff Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Original Broken Selector */}
        <div className="bg-apple-red-light/60 p-3.5 rounded-2xl border border-apple-red/20">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-apple-red flex items-center gap-1 font-bold">
              <XCircle className="w-3 h-3" /> Original Selector (Failed)
            </span>
            <span className="text-[10px] font-mono text-apple-red/70">Target V1</span>
          </div>
          <code className="text-xs font-mono text-apple-red font-bold break-all bg-white/80 p-2 rounded-xl block border border-apple-red/20">
            {selectedStep.originalSelector}
          </code>
        </div>

        {/* Healed Dynamic Selector */}
        <div className="bg-apple-green-light/60 p-3.5 rounded-2xl border border-apple-green/20">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-apple-green flex items-center gap-1 font-bold">
              <CheckCircle className="w-3 h-3" /> Healed Dynamic Selector
            </span>
            <span className="text-[10px] font-mono text-apple-green/70">AI V2</span>
          </div>
          <code className="text-xs font-mono text-apple-green font-bold break-all bg-white/80 p-2 rounded-xl block border border-apple-green/20">
            {selectedStep.resolvedSelector || (isBug ? 'NONE (HALTED TO PREVENT FALSE PASS)' : selectedStep.originalSelector)}
          </code>
        </div>
      </div>

      {/* Confidence Score Bar */}
      {isHealed && (
        <div className="bg-black/[0.02] p-3.5 rounded-2xl border border-black/[0.04]">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-apple-secondary font-mono text-[11px] font-medium">AI Confidence Rating:</span>
            <span className="font-mono font-bold text-apple-green">{confidence}% Confidence Match</span>
          </div>
          <div className="w-full h-2 rounded-full bg-black/[0.06] overflow-hidden">
            <div 
              className="h-full bg-apple-green rounded-full transition-all duration-1000 shadow-sm"
              style={{ width: `${confidence}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Natural Language AI Explanation */}
      <div className="bg-black/[0.02] p-4 rounded-2xl border border-black/[0.04]">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Sparkles className="w-3.5 h-3.5 text-apple-blue" />
          <span className="text-xs font-bold text-apple-text uppercase tracking-wider font-mono">
            Autonomous Reasoning Log
          </span>
        </div>
        <p className="text-xs text-apple-secondary leading-relaxed font-sans">
          {healing.reasoning || selectedStep.error || 'This step completed using its baseline DOM selector without requiring dynamic intervention.'}
        </p>
      </div>
    </div>
  );
}
