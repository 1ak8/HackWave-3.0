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
            <span className="w-2.5 h-2.5 rounded-full bg-brand"></span> Auto-Healed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-danger"></span> Real Bug
          </span>
        </div>
      </div>

      {/* Nodes Grid — compact, all 4 in one row on lg+ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {steps.map((step, idx) => {
          const ActionIcon = getActionIcon(step.action);
          const isSelected = selectedStep && selectedStep.order === step.order;
          const isHealing = step.status === 'healing';
          const isActuallyHealed = step.status === 'healed' && step.resolvedSelector && step.resolvedSelector !== step.originalSelector;
          const isPassed = step.status === 'passed' || (step.status === 'healed' && (!step.resolvedSelector || step.resolvedSelector === step.originalSelector));
          const isFailed = step.status === 'failed';
          const isRunning = step.status === 'running';

          let cardStyle = 'border-border bg-surface-raised hover:border-border-strong shadow-card';
          let statusBadge = null;

          if (isHealing) {
            cardStyle = 'border-amber-400 bg-warning-bg/30 ring-2 ring-amber-400';
            statusBadge = (
              <span className="badge badge-warning text-2xs py-0.5 font-bold">
                <Loader2 className="w-3 h-3 animate-spin" />
                Healing...
              </span>
            );
          } else if (isActuallyHealed) {
            cardStyle = 'border-brand-border bg-brand-light/40 ring-1 ring-brand/40';
            statusBadge = (
              <span className="badge badge-brand text-2xs py-0.5 font-bold">
                <Sparkles className="w-3 h-3" />
                Healed {step.healingDetails?.confidence ? `(${step.healingDetails.confidence}%)` : ''}
              </span>
            );
          } else if (isFailed) {
            cardStyle = 'border-danger-border bg-danger-bg ring-1 ring-red-300';
            statusBadge = (
              <span className="badge badge-danger text-2xs py-0.5 font-bold">
                <ShieldAlert className="w-3 h-3" />
                Bug Triaged
              </span>
            );
          } else if (isPassed) {
            cardStyle = 'border-success-border bg-success-bg ring-1 ring-green-300';
            statusBadge = (
              <span className="badge badge-success text-2xs py-0.5 font-bold">
                <CheckCircle2 className="w-3 h-3" /> Passed
              </span>
            );
          } else if (isRunning) {
            cardStyle = 'border-brand bg-brand-light/30 ring-2 ring-brand';
            statusBadge = (
              <span className="badge badge-brand text-2xs py-0.5 font-bold">
                <Loader2 className="w-3 h-3 animate-spin" /> Running
              </span>
            );
          }

          return (
            <motion.div
              key={step.order || idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.25, delay: idx * 0.04, ease: 'easeOut' }}
              onClick={() => onSelectStep && onSelectStep(step)}
              className={`p-3 rounded-xl border transition-colors cursor-pointer relative space-y-2 ${cardStyle} ${
                isSelected ? 'ring-2 ring-brand border-brand shadow-card-md' : ''
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-4 h-4 rounded bg-surface border border-border flex items-center justify-center text-2xs font-mono font-bold text-ink-secondary shrink-0">
                    {step.order}
                  </span>
                  <ActionIcon className="w-3 h-3 text-ink-secondary shrink-0" />
                  <span className="text-xs font-bold text-ink truncate">
                    {step.name}
                  </span>
                </div>
                <span className="shrink-0">{statusBadge}</span>
              </div>

              {/* Goal Description (short & punchy) */}
              <p className="text-2xs text-ink-secondary line-clamp-1 font-medium">
                Goal: <span className="text-ink font-semibold">{step.intent}</span>
              </p>

              {/* Selector details */}
              <div className="pt-1.5 border-t border-border flex items-center justify-between gap-2 text-2xs font-mono">
                <span className="truncate min-w-0">
                  {isActuallyHealed ? (
                    <span className="line-through text-danger mr-1">{step.originalSelector}</span>
                  ) : null}
                  <span className={isActuallyHealed ? 'text-brand font-bold' : 'text-ink-secondary'}>
                    {step.resolvedSelector || step.originalSelector}
                  </span>
                </span>
                <span className="text-ink-tertiary text-2xs shrink-0 font-medium">
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
