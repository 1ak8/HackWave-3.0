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
  Search,
  ArrowRight
} from 'lucide-react';

export default function IntentGraph({ steps = [], onSelectStep = null, selectedStep = null }) {
  if (!steps || steps.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed border-border rounded-xl bg-surface">
        <p className="text-xs text-ink-secondary font-mono">No execution nodes to display. Launch a test to watch real-time intent flow.</p>
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-brand" />
          <h3 className="text-sm font-bold text-ink tracking-tight">Intent Execution Graph</h3>
          <span className="badge badge-brand text-2xs">Autonomous Steps</span>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-ink-secondary">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-success"></span> Passed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span> Healing
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Auto-Healed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-danger"></span> Regressed Bug
          </span>
        </div>
      </div>

      {/* Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {steps.map((step, idx) => {
          const ActionIcon = getActionIcon(step.action);
          const isSelected = selectedStep && selectedStep.order === step.order;
          const isHealing = step.status === 'healing';
          const isHealed = step.status === 'healed';
          const isPassed = step.status === 'passed';
          const isFailed = step.status === 'failed';
          const isRunning = step.status === 'running';

          let cardStyle = 'border-border bg-white hover:border-border-strong';
          let statusBadge = null;

          if (isHealing) {
            cardStyle = 'border-amber-400 bg-warning-bg/30 ring-1 ring-amber-400';
            statusBadge = (
              <span className="badge badge-warning text-2xs">
                <Loader2 className="w-2.5 h-2.5 animate-spin" />
                Healing...
              </span>
            );
          } else if (isHealed) {
            cardStyle = 'border-indigo-300 bg-brand-light/30 ring-1 ring-indigo-200';
            statusBadge = (
              <span className="badge badge-brand text-2xs">
                <Sparkles className="w-2.5 h-2.5" />
                Healed {step.healingDetails?.confidence ? `(${step.healingDetails.confidence}%)` : ''}
              </span>
            );
          } else if (isFailed) {
            cardStyle = 'border-danger-border bg-danger-bg/40 ring-1 ring-danger-border';
            statusBadge = (
              <span className="badge badge-danger text-2xs">
                <ShieldAlert className="w-2.5 h-2.5" />
                Bug Triaged
              </span>
            );
          } else if (isPassed) {
            cardStyle = 'border-border bg-white';
            statusBadge = (
              <span className="badge badge-success text-2xs">
                <CheckCircle2 className="w-2.5 h-2.5" /> Passed
              </span>
            );
          } else if (isRunning) {
            cardStyle = 'border-brand bg-brand-light/20 ring-1 ring-brand';
            statusBadge = (
              <span className="badge badge-brand text-2xs">
                <Loader2 className="w-2.5 h-2.5 animate-spin" /> Running
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
              className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${cardStyle} ${
                isSelected ? 'ring-2 ring-brand border-brand shadow-sm' : ''
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-surface border border-border flex items-center justify-center text-2xs font-mono font-bold text-ink-secondary">
                    {step.order}
                  </span>
                  <ActionIcon className="w-3.5 h-3.5 text-ink-secondary" />
                  <span className="text-xs font-bold text-ink tracking-tight truncate max-w-[130px]">
                    {step.name}
                  </span>
                </div>
                {statusBadge}
              </div>

              {/* Intent Description */}
              <div className="mb-2">
                <p className="text-xs text-ink-secondary line-clamp-2 leading-relaxed">
                  <span className="text-ink-tertiary text-2xs font-semibold uppercase tracking-wider">Goal:</span> "{step.intent}"
                </p>
              </div>

              {/* Selector details */}
              <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs font-mono">
                <span className="truncate max-w-[170px]">
                  {isHealed ? (
                    <span className="line-through text-danger text-2xs mr-1">{step.originalSelector}</span>
                  ) : null}
                  <span className={isHealed ? 'text-brand font-bold' : 'text-ink-secondary'}>
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
