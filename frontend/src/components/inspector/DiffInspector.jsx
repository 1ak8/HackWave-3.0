import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Cpu, 
  FileCode, 
  ArrowRight, 
  Loader2, 
  Clock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function DiffInspector({ selectedStep, steps = [], onSelectStep = null }) {
  if (!selectedStep) {
    return (
      <div className="card h-full flex flex-col items-center justify-center p-8 text-center bg-surface border-dashed">
        <FileCode className="w-8 h-8 text-ink-tertiary mb-2" />
        <h4 className="text-base font-bold text-ink">Select a Step Above</h4>
        <p className="text-xs text-ink-secondary mt-1 max-w-xs">
          Click any step node in the Intent Graph above to inspect its live DOM selector status.
        </p>
      </div>
    );
  }

  const healing = selectedStep.healingDetails || {};
  const isHealing = selectedStep.status === 'healing';
  const isRunning = selectedStep.status === 'running';
  const isPending = selectedStep.status === 'pending';
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
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-ink">
                Step #{selectedStep.order} — {selectedStep.name}
              </h4>

              {/* Step Navigation Arrows */}
              {steps && steps.length > 1 && onSelectStep && (
                <div className="flex items-center gap-1 bg-surface border border-border px-1.5 py-0.5 rounded-md text-2xs">
                  <button
                    onClick={() => {
                      const idx = steps.findIndex(s => s.order === selectedStep.order);
                      if (idx > 0) onSelectStep(steps[idx - 1]);
                    }}
                    disabled={steps.findIndex(s => s.order === selectedStep.order) <= 0}
                    className="hover:text-brand disabled:opacity-30 disabled:cursor-not-allowed p-0.5"
                    title="Inspect Previous Step"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono text-ink-tertiary">
                    {selectedStep.order}/{steps.length}
                  </span>
                  <button
                    onClick={() => {
                      const idx = steps.findIndex(s => s.order === selectedStep.order);
                      if (idx < steps.length - 1) onSelectStep(steps[idx + 1]);
                    }}
                    disabled={steps.findIndex(s => s.order === selectedStep.order) >= steps.length - 1}
                    className="hover:text-brand disabled:opacity-30 disabled:cursor-not-allowed p-0.5"
                    title="Inspect Next Step"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
            <p className="text-xs text-ink-secondary font-mono">Action: <span className="font-semibold text-ink">{selectedStep.action}</span></p>
          </div>
        </div>

        <div>
          {isHealing && (
            <span className="badge badge-warning text-xs px-2.5 py-1 font-bold animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              AI HEALING...
            </span>
          )}
          {isRunning && !isHealing && (
            <span className="badge badge-brand text-xs px-2.5 py-1 font-bold animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              RUNNING...
            </span>
          )}
          {isActuallyHealed && !isHealing && (
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
          {!isActuallyHealed && !isBug && !isHealing && !isRunning && !isPending && (
            <span className="badge badge-success text-xs px-2.5 py-1 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Passed Directly (Baseline)
            </span>
          )}
          {isPending && (
            <span className="badge badge-neutral text-xs px-2.5 py-1 font-mono">
              Waiting in Pipeline...
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

      {/* Selector Display Area */}
      {isHealing ? (
        /* Actively analyzing state */
        <div className="bg-warning-bg p-4 rounded-xl border border-warning-border space-y-2 text-warning-text text-xs font-mono">
          <div className="font-bold flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-amber-600 shrink-0" />
            <span>AI Reasoning Engine Analyzing DOM...</span>
          </div>
          <p className="text-warning-text leading-relaxed font-sans">
            Baseline selector missing or mutated. Engine is extracting the accessibility tree and comparing candidate elements against goal "{selectedStep.intent}".
          </p>
        </div>
      ) : isRunning ? (
        /* Direct Playwright execution */
        <div className="bg-surface p-4 rounded-xl border border-border space-y-2 text-ink text-xs font-mono">
          <div className="font-bold flex items-center gap-2 text-brand">
            <Loader2 className="w-4 h-4 animate-spin text-brand shrink-0" />
            <span>Playwright Executing Direct Action...</span>
          </div>
          <p className="text-ink-secondary leading-relaxed font-sans">
            Testing baseline selector <code className="font-bold text-ink bg-surface-raised px-1.5 py-0.5 rounded border border-border">{selectedStep.originalSelector}</code> directly via Playwright browser automation without AI intervention.
          </p>
        </div>
      ) : isActuallyHealed ? (
        /* Real Diff shown when selector changed */
        <div className="bg-[#0f172a] text-slate-100 p-4 rounded-xl font-mono text-xs space-y-2.5 border border-slate-800 shadow-inner">
          <div className="flex items-center justify-between text-ink-tertiary pb-2 border-b border-slate-800">
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
            <span className="ml-auto text-2xs bg-red-900/70 px-2 py-0.5 rounded text-red-200 font-sans font-bold shrink-0">
              BROKEN
            </span>
          </div>

          {/* Healed Replacement (+) */}
          <div className="bg-emerald-950/60 text-emerald-200 p-2.5 rounded-lg flex items-center gap-2 border border-emerald-900/50">
            <span className="text-emerald-400 font-extrabold select-none text-sm">+</span>
            <span className="break-all font-mono font-bold text-emerald-300">
              {selectedStep.resolvedSelector}
            </span>
            <span className="ml-auto text-2xs bg-emerald-900/70 px-2 py-0.5 rounded text-emerald-200 font-sans font-bold shrink-0">
              AUTO-HEALED
            </span>
          </div>
        </div>
      ) : isBug ? (
        /* Genuine bug display */
        <div className="bg-danger-bg p-4 rounded-xl border border-danger-border space-y-2 text-danger text-xs font-mono">
          <div className="font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>AI Smart Triage Halted Execution</span>
          </div>
          <p className="text-danger-text leading-relaxed font-sans">
            {selectedStep.error || 'Server error 500 encountered with pricing anomaly ($0.00). AI engine verified this is a true application defect and refused to false-heal.'}
          </p>
        </div>
      ) : isPending ? (
        /* Pending execution */
        <div className="bg-surface p-4 rounded-xl border border-border flex items-center justify-between font-mono text-xs">
          <span className="text-ink-secondary">Target Selector (Pending):</span>
          <span className="font-bold text-ink-tertiary">{selectedStep.originalSelector}</span>
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
            : isHealing
            ? 'Selector mutated or missing in DOM. AI located dynamic replacement element via accessibility role and intent analysis.'
            : isRunning
            ? 'Playwright actively executing direct action on target selector in browser.'
            : isPending
            ? 'This step is queued to execute in the pipeline.'
            : 'Target component responded normally to baseline selector without requiring dynamic healing.'}
        </p>
      </div>
    </div>
  );
}
