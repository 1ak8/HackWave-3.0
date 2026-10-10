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
      <div className="h-full flex flex-col items-center justify-center p-8 text-center border border-slate-200 rounded-2xl bg-white shadow-sm">
        <FileDiff className="w-10 h-10 text-slate-400 mb-3" />
        <h4 className="text-sm font-bold text-slate-800">No Step Selected</h4>
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
    <div className="border border-slate-200 rounded-2xl bg-white p-5 shadow-sm flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-brand-600" />
          <h4 className="text-sm font-bold text-slate-900 tracking-tight">
            Step Inspector: #{selectedStep.order} — {selectedStep.name}
          </h4>
        </div>
        <div>
          {isHealed && (
            <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Harmless UI Mutation (Auto-Healed)
            </span>
          )}
          {isBug && (
            <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-red-50 text-red-800 border border-red-200 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              Genuine Bug Triaged (Halted)
            </span>
          )}
          {!isHealed && !isBug && (
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              Clean Execution
            </span>
          )}
        </div>
      </div>

      {/* Target User Intent */}
      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1 font-bold">
          Target User Intent
        </span>
        <p className="text-xs text-slate-900 font-semibold">"{selectedStep.intent}"</p>
      </div>

      {/* Before / After Selector Diff Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Original Broken Selector */}
        <div className="bg-red-50/60 p-3.5 rounded-xl border border-red-200">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-red-700 flex items-center gap-1 font-bold">
              <XCircle className="w-3 h-3 text-red-600" /> Original Selector (Failed)
            </span>
            <span className="text-[10px] font-mono text-red-500">Target V1</span>
          </div>
          <code className="text-xs font-mono text-red-800 font-bold break-all bg-white p-2 rounded block border border-red-200">
            {selectedStep.originalSelector}
          </code>
        </div>

        {/* Healed Dynamic Selector */}
        <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-800 flex items-center gap-1 font-bold">
              <CheckCircle className="w-3 h-3 text-emerald-600" /> Healed Dynamic Selector
            </span>
            <span className="text-[10px] font-mono text-emerald-600">Autonomous AI V2</span>
          </div>
          <code className="text-xs font-mono text-emerald-800 font-bold break-all bg-white p-2 rounded block border border-emerald-200">
            {selectedStep.resolvedSelector || (isBug ? 'NONE (HALTED TO PREVENT FALSE PASS)' : selectedStep.originalSelector)}
          </code>
        </div>
      </div>

      {/* Confidence Score Bar */}
      {isHealed && (
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-600 font-mono text-[11px] font-semibold">AI Confidence Rating:</span>
            <span className="font-mono font-bold text-emerald-700">{confidence}% Confidence Match</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-1000"
              style={{ width: `${confidence}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Natural Language AI Explanation */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
            Autonomous Reasoning Log
          </span>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed font-sans">
          {healing.reasoning || selectedStep.error || 'This step completed using its baseline DOM selector without requiring dynamic intervention.'}
        </p>
      </div>
    </div>
  );
}
