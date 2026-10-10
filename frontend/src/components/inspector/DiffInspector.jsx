import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Cpu, 
  FileCode
} from 'lucide-react';

export default function DiffInspector({ selectedStep }) {
  if (!selectedStep) {
    return (
      <div className="card h-full flex flex-col items-center justify-center p-8 text-center bg-surface border-dashed">
        <FileCode className="w-8 h-8 text-ink-tertiary mb-2" />
        <h4 className="text-base font-bold text-ink">Select a Step</h4>
        <p className="text-xs text-ink-secondary mt-1 max-w-xs">
          Click any step above to inspect its selector diff and AI healing rationale.
        </p>
      </div>
    );
  }

  const healing = selectedStep.healingDetails || {};
  const isHealed = selectedStep.status === 'healed' || healing.wasHealed;
  const isBug = selectedStep.status === 'failed' || healing.classification === 'Genuine_Bug';
  const confidence = healing.confidence || 0;

  return (
    <div className="card h-full flex flex-col space-y-4 p-5 shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-brand-light border border-brand-border flex items-center justify-center text-brand">
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
          {isHealed && (
            <span className="badge badge-success text-xs px-2.5 py-1 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Auto-Healed
            </span>
          )}
          {isBug && (
            <span className="badge badge-danger text-xs px-2.5 py-1 font-bold">
              <AlertTriangle className="w-3.5 h-3.5" />
              Regression Triaged
            </span>
          )}
          {!isHealed && !isBug && (
            <span className="badge badge-neutral text-xs px-2.5 py-1">
              Clean Pass
            </span>
          )}
        </div>
      </div>

      {/* Target User Intent (short & clear) */}
      <div className="bg-surface p-3 rounded-lg border border-border">
        <span className="text-xs font-mono uppercase text-ink-tertiary block mb-0.5 font-bold">
          Goal:
        </span>
        <p className="text-sm text-ink font-semibold">"{selectedStep.intent}"</p>
      </div>

      {/* Selector Mutation Diff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Baseline Selector */}
        <div className="bg-danger-bg/40 p-3 rounded-xl border border-danger-border">
          <span className="text-xs font-mono uppercase text-danger-text flex items-center gap-1 font-bold mb-1.5">
            <XCircle className="w-3.5 h-3.5" /> Baseline (Broken)
          </span>
          <code className="text-xs font-mono text-danger font-bold break-all bg-white p-2.5 rounded-lg border border-danger-border block shadow-xs">
            {selectedStep.originalSelector}
          </code>
        </div>

        {/* Resolved Dynamic Selector */}
        <div className="bg-success-bg/40 p-3 rounded-xl border border-success-border">
          <span className="text-xs font-mono uppercase text-success-text flex items-center gap-1 font-bold mb-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Healed Selector
          </span>
          <code className="text-xs font-mono text-success font-bold break-all bg-white p-2.5 rounded-lg border border-success-border block shadow-xs">
            {selectedStep.resolvedSelector || (isBug ? 'NONE (HALTED TO PREVENT BUG)' : selectedStep.originalSelector)}
          </code>
        </div>
      </div>

      {/* Confidence Score Bar */}
      {isHealed && (
        <div className="bg-surface p-3 rounded-xl border border-border">
          <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
            <span className="text-ink-secondary font-semibold">AI Confidence:</span>
            <span className="font-bold text-success-text text-xs">{confidence}% Match</span>
          </div>
          <div className="w-full h-2 rounded-full bg-border overflow-hidden">
            <div 
              className="h-full bg-success rounded-full transition-all duration-700"
              style={{ width: `${confidence}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Natural Language AI Rationale */}
      <div className="bg-surface p-3.5 rounded-xl border border-border flex-1">
        <div className="flex items-center gap-1.5 mb-1 text-ink text-xs font-bold font-mono">
          <Sparkles className="w-3.5 h-3.5 text-brand" />
          <span>Resolution Rationale</span>
          {healing.strategyLayer && (
            <span className="text-xs font-mono text-ink-tertiary">({healing.strategyLayer})</span>
          )}
        </div>
        <p className="text-xs text-ink-secondary leading-relaxed">
          {healing.reasoning || selectedStep.error || 'This step executed against its baseline DOM selector without requiring dynamic repair.'}
        </p>
      </div>
    </div>
  );
}
