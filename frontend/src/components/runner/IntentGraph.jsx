import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Loader2, 
  Sparkles, 
  ShieldAlert,
  Zap,
  MousePointer,
  Edit3,
  Search
} from 'lucide-react';

export default function IntentGraph({ steps = [], onSelectStep = null, selectedStep = null }) {
  if (!steps || steps.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed border-border rounded-xl bg-surface">
        <p className="text-sm text-ink-secondary font-mono">No steps to display. Click "Launch Auto-Heal Demo" to start!</p>
      </div>
    );
  }

  const getActionIcon = (action) => {
    switch (action) {
      case 'click': return MousePointer;
      case 'fill': return Edit3;
      case 'assert': return Search;
      default: return Zap;
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Header and Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-brand" />
          <h3 className="text-base font-bold text-ink tracking-tight">Test Step Execution Flow</h3>
          <span className="text-xs text-ink-tertiary">(Click any step to inspect selector diff)</span>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-ink-secondary">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-success"></span> Passed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span> Healing
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> Auto-Healed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-danger"></span> Real Bug
          </span>
        </div>
      </div>

      {/* Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {steps.map((step, idx) => {
          const ActionIcon = getActionIcon(step.action);
          const isSelected = selectedStep && selectedStep.order === step.order;
          const isHealing = step.status === 'healing';
          const isHealed = step.status === 'healed';
          const isPassed = step.status === 'passed';
          const isFailed = step.status === 'failed';
          const isRunning = step.status === 'running';

          let cardStyle = 'border-border bg-white hover:border-border-strong shadow-card';
          let statusBadge = null;

          if (isHealing) {
            cardStyle = 'border-amber-400 bg-warning-bg/30 ring-2 ring-amber-400';
            statusBadge = (
              <span className="badge badge-warning text-xs font-bold">
                <Loader2 className="w-3 h-3 animate-spin" />
                Healing...
              </span>
            );
          } else if (isHealed) {
            cardStyle = 'border-indigo-300 bg-brand-light/40 ring-1 ring-indigo-300';
            statusBadge = (
              <span className="badge badge-brand text-xs font-bold">
                <Sparkles className="w-3 h-3" />
                Healed {step.healingDetails?.confidence ? `(${step.healingDetails.confidence}%)` : ''}
              </span>
            );
          } else if (isFailed) {
            cardStyle = 'border-danger-border bg-danger-bg/40 ring-1 ring-danger-border';
            statusBadge = (
              <span className="badge badge-danger text-xs font-bold">
                <ShieldAlert className="w-3 h-3" />
                Bug Triaged
              </span>
            );
          } else if (isPassed) {
            cardStyle = 'border-border bg-white';
            statusBadge = (
              <span className="badge badge-success text-xs font-bold">
                <CheckCircle2 className="w-3 h-3" /> Passed
              </span>
            );
          } else if (isRunning) {
            cardStyle = 'border-brand bg-brand-light/30 ring-2 ring-brand';
            statusBadge = (
              <span className="badge badge-brand text-xs font-bold">
                <Loader2 className="w-3 h-3 animate-spin" /> Running
              </span>
            );
          }

          return (
            <motion.div
              key={step.order || idx}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.12, delay: idx * 0.02 }}
              onClick={() => onSelectStep && onSelectStep(step)}
              className={`p-4 rounded-xl border transition-all cursor-pointer relative space-y-2.5 ${cardStyle} ${
                isSelected ? 'ring-2 ring-brand border-brand shadow-card-md' : ''
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-surface border border-border flex items-center justify-center text-xs font-mono font-bold text-ink-secondary">
                    {step.order}
                  </span>
                  <ActionIcon className="w-3.5 h-3.5 text-ink-secondary" />
                  <span className="text-sm font-bold text-ink truncate max-w-[150px]">
                    {step.name}
                  </span>
                </div>
                {statusBadge}
              </div>

              {/* Goal Description (short & punchy) */}
              <p className="text-xs text-ink-secondary line-clamp-1 font-medium">
                Goal: <span className="text-ink font-semibold">{step.intent}</span>
              </p>

              {/* Selector details */}
              <div className="pt-2 border-t border-border flex items-center justify-between text-xs font-mono">
                <span className="truncate max-w-[190px]">
                  {isHealed ? (
                    <span className="line-through text-danger mr-1.5">{step.originalSelector}</span>
                  ) : null}
                  <span className={isHealed ? 'text-brand font-bold' : 'text-ink-secondary'}>
                    {step.resolvedSelector || step.originalSelector}
                  </span>
                </span>
                <span className="text-ink-tertiary text-xs shrink-0 font-medium">
                  {step.durationMs ? `${step.durationMs}ms` : ''}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
