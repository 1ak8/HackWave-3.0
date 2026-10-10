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

export default function IntentGraph({ steps = [], activeStepIndex = null, onSelectStep = null, selectedStep = null }) {
  if (!steps || steps.length === 0) {
    return (
      <div className="p-8 text-center border border-black/[0.06] rounded-2xl bg-white/60 shadow-apple-sm">
        <p className="text-xs text-apple-secondary font-mono">No execution nodes to render. Launch a test to watch real-time intent flow.</p>
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
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-apple-blue/10 flex items-center justify-center text-apple-blue">
            <Zap className="w-3.5 h-3.5 fill-current" />
          </div>
          <h3 className="text-sm font-bold text-apple-text tracking-tight">Intent Graph</h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-apple-blue/10 text-apple-blue font-semibold">
            Visual Healing Flow
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-mono text-apple-secondary">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-apple-green"></span> Passed</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-apple-orange animate-ping"></span> Healing</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-apple-green ring-2 ring-apple-green/30"></span> Healed</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-apple-red"></span> Bug Triaged</span>
        </div>
      </div>

      {/* Nodes Grid (Apple Squircle Card Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {steps.map((step, idx) => {
          const ActionIcon = getActionIcon(step.action);
          const isSelected = selectedStep && selectedStep.order === step.order;
          const isHealing = step.status === 'healing';
          const isHealed = step.status === 'healed';
          const isPassed = step.status === 'passed';
          const isFailed = step.status === 'failed';
          const isRunning = step.status === 'running';

          let borderClass = 'border-black/[0.06] bg-white hover:border-black/[0.12] shadow-apple-card';
          let glowBadge = null;

          if (isHealing) {
            borderClass = 'border-apple-orange bg-apple-orange-light shadow-[0_4px_20px_rgba(255,149,0,0.15)] animate-pulse';
            glowBadge = (
              <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-apple-orange bg-white px-2 py-0.5 rounded-full border border-apple-orange/30 shadow-sm">
                <Loader2 className="w-3 h-3 animate-spin" />
                HEALING...
              </span>
            );
          } else if (isHealed) {
            borderClass = 'border-apple-green/60 bg-apple-green-light shadow-[0_4px_20px_rgba(52,199,89,0.12)]';
            glowBadge = (
              <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-apple-green bg-white px-2 py-0.5 rounded-full border border-apple-green/30 shadow-sm">
                <Sparkles className="w-3 h-3 text-apple-green" />
                HEALED {step.healingDetails?.confidence ? `(${step.healingDetails.confidence}%)` : ''}
              </span>
            );
          } else if (isFailed) {
            borderClass = 'border-apple-red/60 bg-apple-red-light shadow-[0_4px_20px_rgba(255,59,48,0.12)]';
            glowBadge = (
              <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-apple-red bg-white px-2 py-0.5 rounded-full border border-apple-red/30 shadow-sm">
                <ShieldAlert className="w-3 h-3" />
                TRIAGED BUG
              </span>
            );
          } else if (isPassed) {
            borderClass = 'border-black/[0.06] bg-white';
            glowBadge = (
              <span className="text-[10px] font-mono font-bold text-apple-green flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> PASSED
              </span>
            );
          } else if (isRunning) {
            borderClass = 'border-apple-blue/50 bg-apple-blue-light animate-pulse';
            glowBadge = (
              <span className="text-[10px] font-mono font-bold text-apple-blue flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" /> RUNNING
              </span>
            );
          }

          return (
            <motion.div
              key={step.order || idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, delay: idx * 0.03 }}
              onClick={() => onSelectStep && onSelectStep(step)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden active:scale-[0.99] ${borderClass} ${
                isSelected ? 'ring-2 ring-apple-blue ring-offset-2' : ''
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-black/[0.04] flex items-center justify-center text-[11px] font-mono text-apple-secondary font-bold">
                    {step.order}
                  </div>
                  <ActionIcon className="w-3.5 h-3.5 text-apple-secondary" />
                  <span className="text-xs font-bold text-apple-text tracking-tight truncate max-w-[130px]">
                    {step.name}
                  </span>
                </div>
                {glowBadge}
              </div>

              {/* User Intent */}
              <div className="mb-2.5">
                <p className="text-xs text-apple-secondary line-clamp-2 leading-relaxed">
                  <span className="text-apple-tertiary font-mono text-[10px]">Intent:</span> "{step.intent}"
                </p>
              </div>

              {/* Selector details */}
              <div className="pt-2 border-t border-black/[0.04] flex items-center justify-between text-xs font-mono">
                <span className="text-apple-secondary truncate max-w-[150px]">
                  {isHealed ? (
                    <span className="line-through text-apple-red mr-1.5">{step.originalSelector}</span>
                  ) : null}
                  <span className={isHealed ? 'text-apple-green font-bold' : 'text-apple-text'}>
                    {step.resolvedSelector || step.originalSelector}
                  </span>
                </span>
                <span className="text-apple-tertiary text-[11px]">
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
