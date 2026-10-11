import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Cpu, 
  FileCode,
  ArrowRight
} from 'lucide-react';

export default function DiffInspector({ selectedStep }) {
  if (!selectedStep) {
    return (
      <div className="card h-full flex flex-col items-center justify-center p-8 text-center bg-surface border-dashed">
        <FileCode className="w-8 h-8 text-ink-tertiary mb-2" />
        <h4 className="text-base font-bold text-ink">Select a Step Above</h4>
        <p className="text-xs text-ink-secondary mt-1 max-w-xs">
          Click any step node in the graph above to inspect its DOM selector repair diff.
        </p>
      </div>
    );
  }

  const healing = selectedStep.healingDetails || {};
  const isActuallyHealed = selectedStep.status === 'healed' && 
    selectedStep.resolvedSelector && 
    selectedStep.resolvedSelector !== selectedStep.originalSelector;

  const isBug = selectedStep.status === 'failed' || healing.classification === 'Genuine_Bug';
  const confidence = healing.confidence || 0;

  return (
    <div className="card h-full flex flex-col space-y-4 p-5 shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-light border border-brand-border flex items-center justify-center text-brand">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-ink">
              Step #{selectedStep.order} — {selectedStep.name}
            </h4>
            <p className="text-xs text-ink-secondary font-mono">Action: <span className="font-semibold text-ink">{selectedStep.action}</span></p>
          </div>
        </div>

        <div>
          {isActuallyHealed && (
            <span className="badge badge-brand text-xs px-2.5 py-1 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              Auto-Healed ({confidence}%)
            </span>
          )}
          {isBug && (
            <span className="badge badge-danger text-xs px-2.5 py-1 font-bold">
              <AlertTriangle className="w-3.5 h-3.5" />
              Regression Triaged
            </span>
          )}
          {!isActuallyHealed && !isBug && (
            <span className="badge badge-success text-xs px-2.5 py-1 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Passed Directly (Baseline)
            </span>
          )}
        </div>
      </div>

      {/* Target User Intent */}
      <div className="bg-surface p-3 rounded-lg border border-border">
        <span className="text-xs font-mono uppercase text-ink-tertiary block mb-0.5 font-bold">
          User Goal:
        </span>
        <p className="text-sm text-ink font-semibold">"{selectedStep.intent}"</p>
      </div>

      {/* Selector Display */}
      {isActuallyHealed ? (
        /* Real Diff shown when selector changed */
        <div className="bg-[#0f172a] text-slate-100 p-4 rounded-xl font-mono text-xs space-y-2.5 border border-slate-800 shadow-inner">
          <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
            <span className="font-sans font-semibold text-slate-300">DOM Selector Repair Diff</span>
            <span className="text-emerald-400 font-bold font-mono">
              {confidence}% match confidence
            </span>
          </div>

          {/* Broken Selector (-) */}
          <div className="bg-red-950/60 text-red-200 p-2.5 rounded-lg flex items-center gap-2 border border-red-900/50">
            <span className="text-red-400 font-extrabold select-none text-sm">-</span>
            <span className="break-all font-mono line-through text-red-300">
              {selectedStep.originalSelector}
            </span>
            <span className="ml-auto text-[10px] bg-red-900/70 px-2 py-0.5 rounded text-red-200 font-sans font-bold shrink-0">
              BROKEN
            </span>
          </div>

          {/* Healed Replacement (+) */}
          <div className="bg-emerald-950/60 text-emerald-200 p-2.5 rounded-lg flex items-center gap-2 border border-emerald-900/50">
            <span className="text-emerald-400 font-extrabold select-none text-sm">+</span>
            <span className="break-all font-mono font-bold text-emerald-300">
              {selectedStep.resolvedSelector}
            </span>
            <span className="ml-auto text-[10px] bg-emerald-900/70 px-2 py-0.5 rounded text-emerald-200 font-sans font-bold shrink-0">
              AUTO-HEALED
            </span>
          </div>
        </div>
      ) : isBug ? (
        /* Genuine bug display */
        <div className="bg-red-50 p-4 rounded-xl border border-red-200 space-y-2 text-danger text-xs font-mono">
          <div className="font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>AI Smart Triage Halted Execution</span>
          </div>
          <p className="text-red-700 leading-relaxed font-sans">
            {selectedStep.error || 'Server error 500 encountered with pricing anomaly ($0.00). AI engine verified this is a true application defect and refused to false-heal.'}
          </p>
        </div>
      ) : (
        /* Baseline Clean Pass (No Diff because nothing changed!) */
        <div className="bg-surface p-4 rounded-xl border border-border flex items-center justify-between font-mono text-xs">
          <span className="text-ink-secondary">Selector Verified (Baseline):</span>
          <span className="font-bold text-success-text">{selectedStep.originalSelector} (Clean Pass)</span>
        </div>
      )}

      {/* Natural Language AI Rationale */}
      <div className="bg-surface p-3.5 rounded-xl border border-border flex-1">
        <div className="flex items-center gap-1.5 mb-1 text-ink text-xs font-bold font-mono">
          <Sparkles className="w-3.5 h-3.5 text-brand" />
          <span>Execution Rationale</span>
          {healing.strategyLayer && (
            <span className="text-xs font-mono text-ink-tertiary">({healing.strategyLayer})</span>
          )}
        </div>
        <p className="text-xs text-ink-secondary leading-relaxed">
          {isActuallyHealed 
            ? (healing.reasoning || `Selector ${selectedStep.originalSelector} was renamed in the DOM. AI located matching component ${selectedStep.resolvedSelector} via accessibility role and intent analysis.`)
            : isBug
            ? 'Execution safely terminated to prevent defect leakage into production.'
            : 'Target component responded normally to baseline selector without requiring dynamic healing.'}
        </p>
      </div>
    </div>
  );
}
