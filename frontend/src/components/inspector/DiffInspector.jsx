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
        <h4 className="text-sm font-semibold text-ink">No Step Selected</h4>
        <p className="text-xs text-ink-secondary mt-1 max-w-xs">
          Select any node in the Intent Graph above to inspect selector mutation diffs and AI confidence scores.
        </p>
      </div>
    );
  }

  const healing = selectedStep.healingDetails || {};
  const isHealed = selectedStep.status === 'healed' || healing.wasHealed;
  const isBug = selectedStep.status === 'failed' || healing.classification === 'Genuine_Bug';
  const confidence = healing.confidence || 0;

  return (
    <div className="card h-full flex flex-col space-y-4 p-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-light border border-brand-border flex items-center justify-center text-brand">
            <Cpu className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-ink">
              Step #{selectedStep.order} — {selectedStep.name}
            </h4>
            <p className="text-2xs text-ink-secondary font-mono">Action: {selectedStep.action}</p>
          </div>
        </div>

        <div>
          {isHealed && (
            <span className="badge badge-success text-2xs">
              <ShieldCheck className="w-3 h-3" />
              Auto-Healed
            </span>
          )}
          {isBug && (
            <span className="badge badge-danger text-2xs">
              <AlertTriangle className="w-3 h-3" />
              Bug Triaged
            </span>
          )}
          {!isHealed && !isBug && (
            <span className="badge badge-neutral text-2xs">
              Clean Execution
            </span>
          )}
        </div>
      </div>

      {/* Target User Intent */}
      <div className="bg-surface p-3 rounded-lg border border-border">
        <span className="text-2xs font-mono uppercase tracking-wider text-ink-tertiary block mb-1 font-semibold">
          Step Intent Specification
        </span>
        <p className="text-xs text-ink font-medium leading-relaxed">"{selectedStep.intent}"</p>
      </div>

      {/* Selector Mutation Diff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Baseline Selector */}
        <div className="bg-danger-bg/40 p-3 rounded-lg border border-danger-border">
          <div className="flex items-center justify-between mb-1">
            <span className="text-2xs font-mono uppercase tracking-wider text-danger-text flex items-center gap-1 font-bold">
              <XCircle className="w-3 h-3" /> Baseline Selector (Broken)
            </span>
            <span className="text-2xs font-mono text-danger-text/70">Original</span>
          </div>
          <code className="text-xs font-mono text-danger font-bold break-all bg-white p-2 rounded border border-danger-border block">
            {selectedStep.originalSelector}
          </code>
        </div>

        {/* Resolved Dynamic Selector */}
        <div className="bg-success-bg/40 p-3 rounded-lg border border-success-border">
          <div className="flex items-center justify-between mb-1">
            <span className="text-2xs font-mono uppercase tracking-wider text-success-text flex items-center gap-1 font-bold">
              <CheckCircle2 className="w-3 h-3" /> Healed Dynamic Selector
            </span>
            <span className="text-2xs font-mono text-success-text/70">Autonomous</span>
          </div>
          <code className="text-xs font-mono text-success font-bold break-all bg-white p-2 rounded border border-success-border block">
            {selectedStep.resolvedSelector || (isBug ? 'NONE (HALTED AS GENUINE BUG)' : selectedStep.originalSelector)}
          </code>
        </div>
      </div>

      {/* Confidence Score Bar */}
      {isHealed && (
        <div className="bg-surface p-3 rounded-lg border border-border">
          <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
            <span className="text-ink-secondary text-2xs font-medium">Confidence Match:</span>
            <span className="font-bold text-success-text">{confidence}% Confidence</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-border overflow-hidden">
            <div 
              className="h-full bg-success rounded-full transition-all duration-700"
              style={{ width: `${confidence}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Natural Language AI Rationale */}
      <div className="bg-surface p-3 rounded-lg border border-border flex-1">
        <div className="flex items-center gap-1.5 mb-1 text-ink text-xs font-bold font-mono">
          <Sparkles className="w-3.5 h-3.5 text-brand" />
          <span>Autonomous AI Rationale</span>
          {healing.strategyLayer && (
            <span className="text-2xs font-mono text-ink-tertiary">({healing.strategyLayer})</span>
          )}
        </div>
        <p className="text-xs text-ink-secondary leading-relaxed">
          {healing.reasoning || selectedStep.error || 'This step executed against its baseline DOM selector without requiring dynamic repair.'}
        </p>
      </div>
    </div>
  );
}
