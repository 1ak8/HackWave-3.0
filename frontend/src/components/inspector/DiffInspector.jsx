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
      <div className="card h-full flex flex-col items-center justify-center p-10 text-center bg-surface border-dashed">
        <FileCode className="w-10 h-10 text-ink-tertiary mb-3" />
        <h4 className="text-base font-bold text-ink">No Step Selected</h4>
        <p className="text-sm text-ink-secondary mt-1 max-w-sm leading-relaxed">
          Select any node in the Intent Graph above to inspect selector mutation diffs and autonomous AI confidence scores.
        </p>
      </div>
    );
  }

  const healing = selectedStep.healingDetails || {};
  const isHealed = selectedStep.status === 'healed' || healing.wasHealed;
  const isBug = selectedStep.status === 'failed' || healing.classification === 'Genuine_Bug';
  const confidence = healing.confidence || 0;

  return (
    <div className="card h-full flex flex-col space-y-5 p-6 shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-light border border-brand-border flex items-center justify-center text-brand">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-base font-bold text-ink">
              Step #{selectedStep.order} — {selectedStep.name}
            </h4>
            <p className="text-xs text-ink-secondary font-mono mt-0.5">Action: <span className="font-semibold text-ink">{selectedStep.action}</span></p>
          </div>
        </div>

        <div>
          {isHealed && (
            <span className="badge badge-success text-xs px-3 py-1 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Auto-Healed
            </span>
          )}
          {isBug && (
            <span className="badge badge-danger text-xs px-3 py-1 font-bold">
              <AlertTriangle className="w-3.5 h-3.5" />
              Regression Triaged
            </span>
          )}
          {!isHealed && !isBug && (
            <span className="badge badge-neutral text-xs px-3 py-1">
              Clean Execution
            </span>
          )}
        </div>
      </div>

      {/* Target User Intent */}
      <div className="bg-surface p-4 rounded-xl border border-border">
        <span className="text-xs font-mono uppercase tracking-wider text-ink-tertiary block mb-1 font-bold">
          Step Intent Specification
        </span>
        <p className="text-sm text-ink font-semibold leading-relaxed">"{selectedStep.intent}"</p>
      </div>

      {/* Selector Mutation Diff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Baseline Selector */}
        <div className="bg-danger-bg/40 p-4 rounded-xl border border-danger-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-danger-text flex items-center gap-1.5 font-bold">
              <XCircle className="w-3.5 h-3.5" /> Baseline Selector (Broken)
            </span>
            <span className="text-xs font-mono text-danger-text/80 font-medium">Original</span>
          </div>
          <code className="text-sm font-mono text-danger font-bold break-all bg-white p-3 rounded-lg border border-danger-border block shadow-xs">
            {selectedStep.originalSelector}
          </code>
        </div>

        {/* Resolved Dynamic Selector */}
        <div className="bg-success-bg/40 p-4 rounded-xl border border-success-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-success-text flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Healed Dynamic Selector
            </span>
            <span className="text-xs font-mono text-success-text/80 font-medium">Autonomous</span>
          </div>
          <code className="text-sm font-mono text-success font-bold break-all bg-white p-3 rounded-lg border border-success-border block shadow-xs">
            {selectedStep.resolvedSelector || (isBug ? 'NONE (HALTED TO PREVENT REGRESSION)' : selectedStep.originalSelector)}
          </code>
        </div>
      </div>

      {/* Confidence Score Bar */}
      {isHealed && (
        <div className="bg-surface p-4 rounded-xl border border-border">
          <div className="flex items-center justify-between text-xs mb-2 font-mono">
            <span className="text-ink-secondary font-semibold">AI Match Confidence:</span>
            <span className="font-bold text-success-text text-sm">{confidence}% Verified Match</span>
          </div>
          <div className="w-full h-2 rounded-full bg-border overflow-hidden">
            <div 
              className="h-full bg-success rounded-full transition-all duration-700 shadow-sm"
              style={{ width: `${confidence}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Natural Language AI Rationale */}
      <div className="bg-surface p-4 rounded-xl border border-border flex-1">
        <div className="flex items-center gap-2 mb-1.5 text-ink text-xs font-bold font-mono">
          <Sparkles className="w-4 h-4 text-brand" />
          <span>Autonomous Reasoning & Strategy</span>
          {healing.strategyLayer && (
            <span className="text-xs font-mono text-ink-tertiary">({healing.strategyLayer})</span>
          )}
        </div>
        <p className="text-sm text-ink-secondary leading-relaxed">
          {healing.reasoning || selectedStep.error || 'This step executed against its baseline DOM selector without requiring dynamic repair.'}
        </p>
      </div>
    </div>
  );
}
