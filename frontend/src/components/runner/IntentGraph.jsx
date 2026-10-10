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
      <div className="p-8 text-center border border-slate-200 rounded-2xl bg-white shadow-sm">
        <p className="text-xs text-slate-500 font-mono">No execution nodes to render. Launch a test to watch real-time intent flow.</p>
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
          <Zap className="w-4 h-4 text-brand-600" />
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Autonomous Intent Graph</h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200 font-semibold">
            Feature 2: Dynamic Healing Flow
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-mono text-slate-600">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Passed</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span> Healing</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600 border border-emerald-400"></span> Healed</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Bug Triaged</span>
        </div>
      </div>

      {/* Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {steps.map((step, idx) => {
          const ActionIcon = getActionIcon(step.action);
          const isSelected = selectedStep && selectedStep.order === step.order;
          const isHealing = step.status === 'healing';
          const isHealed = step.status === 'healed';
          const isPassed = step.status === 'passed';
          const isFailed = step.status === 'failed';
          const isRunning = step.status === 'running';

          let borderClass = 'border-slate-200 bg-white hover:border-slate-300 shadow-sm';
          let glowBadge = null;

          if (isHealing) {
            borderClass = 'border-amber-400 bg-amber-50/80 shadow-md shadow-amber-500/15 animate-pulse';
            glowBadge = (
              <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                <Loader2 className="w-3 h-3 animate-spin text-amber-700" />
                AI HEALING...
              </span>
            );
          } else if (isHealed) {
            borderClass = 'border-emerald-300 bg-emerald-50/80 shadow-md shadow-emerald-500/10';
            glowBadge = (
              <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                HEALED {step.healingDetails?.confidence ? `(${step.healingDetails.confidence}%)` : ''}
              </span>
            );
          } else if (isFailed) {
            borderClass = 'border-red-300 bg-red-50/80 shadow-md shadow-red-500/10';
            glowBadge = (
              <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-red-800 bg-red-100 px-2 py-0.5 rounded-full border border-red-300">
                <ShieldAlert className="w-3 h-3 text-red-600" />
                TRIAGED BUG
              </span>
            );
          } else if (isPassed) {
            borderClass = 'border-emerald-200 bg-emerald-50/40';
            glowBadge = (
              <span className="text-[10px] font-mono font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> PASSED
              </span>
            );
          } else if (isRunning) {
            borderClass = 'border-indigo-300 bg-indigo-50/60 animate-pulse';
            glowBadge = (
              <span className="text-[10px] font-mono font-bold text-indigo-700 flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin text-indigo-600" /> RUNNING
              </span>
            );
          }

          return (
            <motion.div
              key={step.order || idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.04 }}
              onClick={() => onSelectStep && onSelectStep(step)}
              className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${borderClass} ${
                isSelected ? 'ring-2 ring-brand-600' : ''
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-mono text-slate-700 font-bold">
                    {step.order}
                  </div>
                  <ActionIcon className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-xs font-bold text-slate-900 tracking-tight truncate max-w-[140px]">
                    {step.name}
                  </span>
                </div>
                {glowBadge}
              </div>

              {/* User Intent */}
              <div className="mb-2.5">
                <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed">
                  <span className="text-slate-500 font-mono text-[11px]">Intent:</span> "{step.intent}"
                </p>
              </div>

              {/* Selector Bar */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-600 truncate max-w-[160px]">
                  {isHealed ? (
                    <span className="line-through text-red-500 mr-1.5">{step.originalSelector}</span>
                  ) : null}
                  <span className={isHealed ? 'text-emerald-700 font-bold' : 'text-slate-800'}>
                    {step.resolvedSelector || step.originalSelector}
                  </span>
                </span>
                <span className="text-slate-500 text-[11px]">
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
