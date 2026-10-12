import React from 'react';
import { 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Cpu, 
  FileCode, 
  Loader2, 
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';

export default function DiffInspector({ selectedStep, steps = [], onSelectStep = null }) {
  if (!selectedStep) {
    return (
      <div className="card h-full flex flex-col items-center justify-center p-8 text-center bg-surface border-dashed">
        <FileCode className="w-8 h-8 text-ink-tertiary mb-2" />
        <h4 className="text-sm font-semibold text-ink">Select a Step Above</h4>
        <p className="text-xs text-ink-secondary mt-1 max-w-xs">
          Click any step node in the Intent Graph above to inspect its live DOM selector status.
        </p>
      </div>
    );
  }

  const healing = selectedStep.healingDetails || {};
  const isHealing = selectedStep.status === 'healing';
  const isRunning = selectedStep.status === 'running';
  const isPending = selectedStep.status === 'pending' || !selectedStep.status;
  const isActuallyHealed = selectedStep.status === 'healed' && 
    selectedStep.resolvedSelector && 
    selectedStep.resolvedSelector !== selectedStep.originalSelector;
  const isPassed = selectedStep.status === 'passed';

  const isBug = selectedStep.status === 'failed' || healing.classification === 'Genuine_Bug';
  const confidence = healing.confidence || 0;

  return (
    <div className="card h-full flex flex-col space-y-3.5 p-4 sm:p-5 shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-[#24292f] text-white flex items-center justify-center shadow-card">
            <Cpu className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-semibold text-ink">
                Step #{selectedStep.order} — {selectedStep.name}
              </h4>

              {/* Step Navigation Arrows */}
              {steps && steps.length > 1 && onSelectStep && (
                <div className="flex items-center gap-1 bg-surface border border-border px-1.5 py-0.5 rounded text-2xs">
                  <button
                    onClick={() => {
                      const idx = steps.findIndex(s => s.order === selectedStep.order);
                      if (idx > 0) onSelectStep(steps[idx - 1]);
                    }}
                    disabled={steps.findIndex(s => s.order === selectedStep.order) <= 0}
                    className="hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed p-0.5"
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
                    className="hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed p-0.5"
                    title="Inspect Next Step"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
            <p className="text-2xs text-ink-secondary font-mono">Action: <span className="font-semibold text-ink">{selectedStep.action}</span></p>
          </div>
        </div>

        <div>
          {isHealing && (
            <span className="badge badge-warning text-2xs px-2 py-0.5 font-medium animate-pulse">
              <Loader2 className="w-3 h-3 animate-spin" />
              HEALING...
            </span>
          )}
          {isRunning && !isHealing && (
            <span className="badge badge-info text-2xs px-2 py-0.5 font-medium animate-pulse">
              <Loader2 className="w-3 h-3 animate-spin" />
              RUNNING...
            </span>
          )}
          {isActuallyHealed && !isHealing && (
            <span className="badge badge-info text-2xs px-2 py-0.5 font-medium">
              <Sparkles className="w-3 h-3" />
              Auto-Healed ({confidence}%)
            </span>
          )}
          {isBug && (
            <span className="badge badge-danger text-2xs px-2 py-0.5 font-medium">
              <AlertTriangle className="w-3 h-3" />
              Regression Triaged
            </span>
          )}
          {isPassed && !isActuallyHealed && !isBug && !isHealing && !isRunning && !isPending && (
            <span className="badge badge-success text-2xs px-2 py-0.5 font-medium">
              <CheckCircle2 className="w-3 h-3" />
              Baseline Pass
            </span>
          )}
          {isPending && !isRunning && !isHealing && (
            <span className="badge badge-neutral text-2xs px-2 py-0.5 font-mono">
              Ready / Pending
            </span>
          )}
        </div>
      </div>

      {/* Target User Intent */}
      <div className="bg-surface p-2.5 rounded-md border border-border">
        <span className="text-2xs font-mono uppercase text-ink-secondary block mb-0.5 font-semibold">
          User Goal:
        </span>
        <p className="text-xs text-ink font-medium">"{selectedStep.intent}"</p>
      </div>

      {/* Selector Display Area */}
      {isHealing ? (
        /* Actively analyzing state */
        <div className="bg-[#fff8c5] p-3 rounded-md border border-[#d4a72c] space-y-1.5 text-[#9a6700] text-xs font-mono">
          <div className="font-semibold flex items-center gap-1.5">
            <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
            <span>AI Reasoning Engine Analyzing DOM...</span>
          </div>
          <p className="leading-relaxed font-sans text-2xs">
            Baseline selector missing or mutated. Engine is extracting the accessibility tree and comparing candidate elements against goal "{selectedStep.intent}".
          </p>
        </div>
      ) : isRunning ? (
        /* Direct Playwright execution */
        <div className="bg-surface p-3 rounded-md border border-border space-y-1.5 text-ink text-xs font-mono">
          <div className="font-semibold flex items-center gap-1.5 text-accent">
            <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
            <span>Playwright Executing Direct Action...</span>
          </div>
          <p className="text-ink-secondary leading-relaxed font-sans text-2xs">
            Testing baseline selector <code className="font-semibold text-ink bg-surface-raised px-1 py-0.5 rounded border border-border">{selectedStep.originalSelector}</code> directly via Playwright browser automation without AI intervention.
          </p>
        </div>
      ) : isActuallyHealed ? (
        /* GitHub PR Style Diff View */
        <div className="bg-surface border border-border rounded-md font-mono text-xs overflow-hidden shadow-card">
          <div className="bg-surface-raised px-3 py-1.5 border-b border-border flex items-center justify-between text-ink-secondary text-2xs">
            <span className="font-sans font-semibold text-ink">Files changed: DOM Selector Repair Diff</span>
            <span className="text-[#1a7f37] font-semibold font-mono">
              {confidence}% match confidence
            </span>
          </div>

          {/* Broken Selector (-) Red line */}
          <div className="bg-[#ffebe9] text-[#cf222e] px-3 py-2 flex items-center gap-2 border-b border-[#ff8182]/30">
            <span className="text-[#cf222e] font-bold select-none text-xs">-</span>
            <span className="break-all font-mono line-through">
              {selectedStep.originalSelector}
            </span>
            <span className="ml-auto text-2xs bg-[#cf222e] text-white px-1.5 py-0.5 rounded font-sans font-medium shrink-0">
              BROKEN
            </span>
          </div>

          {/* Healed Replacement (+) Green line */}
          <div className="bg-[#dafbe1] text-[#1a7f37] px-3 py-2 flex items-center gap-2">
            <span className="text-[#1a7f37] font-bold select-none text-xs">+</span>
            <span className="break-all font-mono font-semibold">
              {selectedStep.resolvedSelector}
            </span>
            <span className="ml-auto text-2xs bg-[#1a7f37] text-white px-1.5 py-0.5 rounded font-sans font-medium shrink-0">
              AUTO-HEALED
            </span>
          </div>
        </div>
      ) : isBug ? (
        /* Genuine bug display */
        <div className="bg-[#ffebe9] p-3 rounded-md border border-[#ff8182] space-y-1 text-[#cf222e] text-xs font-mono">
          <div className="font-semibold flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>AI Smart Triage Halted Execution</span>
          </div>
          <p className="leading-relaxed font-sans text-2xs">
            {selectedStep.error || 'Server error 500 encountered with pricing anomaly ($0.00). AI engine verified this is a true application defect and refused to false-heal.'}
          </p>
        </div>
      ) : isPassed ? (
        /* Baseline Clean Pass */
        <div className="bg-surface p-3 rounded-md border border-border flex items-center justify-between font-mono text-xs">
          <span className="text-ink-secondary">Selector Verified (Baseline):</span>
          <span className="font-semibold text-[#1a7f37]">{selectedStep.originalSelector} (Clean Pass)</span>
        </div>
      ) : (
        /* Pending / Ready before test execution */
        <div className="bg-surface p-3 rounded-md border border-border flex items-center justify-between font-mono text-xs">
          <span className="text-ink-secondary">Target Selector (Ready):</span>
          <span className="font-semibold text-ink-secondary font-mono">{selectedStep.originalSelector}</span>
        </div>
      )}

      {/* Execution Rationale */}
      <div className="bg-surface p-3 rounded-md border border-border flex-1">
        <div className="flex items-center gap-1.5 mb-1 text-ink text-xs font-semibold font-mono">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span>Execution Rationale</span>
          {healing.strategyLayer && (
            <span className="text-2xs font-mono text-ink-tertiary">({healing.strategyLayer})</span>
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
            : isPassed
            ? 'Target component responded normally to baseline selector without requiring dynamic healing.'
            : 'Step queued and ready. Click Launch Auto-Heal Demo or Standard run to execute.'}
        </p>
      </div>
    </div>
  );
}
