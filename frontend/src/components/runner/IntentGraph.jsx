import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Sparkles, 
  ArrowRight, 
  ShieldAlert,
  HelpCircle,
  Zap,
  MousePointer,
  Edit3,
  Search
} from 'lucide-react';

export default function IntentGraph({ steps = [], activeStepIndex = null, onSelectStep = null, selectedStep = null }) {
  if (!steps || steps.length === 0) {
    return (
      <div className="p-8 text-center border border-white/5 rounded-2xl bg-obsidian-900/50">
        <p className="text-sm text-slate-400 font-mono">No execution nodes to render. Launch a test to watch real-time intent flow.</p>
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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">Autonomous Intent Graph</h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            Feature 2: Dynamic Healing Flow
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Passed</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span> Healing</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400 border border-amber-300"></span> Healed</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500"></span> Bug Triaged</span>
        </div>
      </div>

      {/* Interactive Horizontal Flow */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {steps.map((step, idx) => {
          const ActionIcon = getActionIcon(step.action);
          const isSelected = selectedStep && selectedStep.order === step.order;
          const isHealing = step.status === 'healing';
          const isHealed = step.status === 'healed';
          const isPassed = step.status === 'passed';
          const isFailed = step.status === 'failed';
          const isRunning = step.status === 'running';

          let borderClass = 'border-white/10 bg-obsidian-900/70 hover:border-white/20';
          let glowBadge = null;

          if (isHealing) {
            borderClass = 'border-amber-500/80 bg-amber-950/40 shadow-[0_0_25px_rgba(245,158,11,0.3)] animate-pulse';
            glowBadge = (
              <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/40 animate-pulse">
                <Loader2 className="w-3 h-3 animate-spin text-amber-400" />
                AI HEALING...
              </span>
            );
          } else if (isHealed) {
            borderClass = 'border-emerald-400/80 bg-emerald-950/30 shadow-[0_0_20px_rgba(16,185,129,0.25)]';
            glowBadge = (
              <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/40">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                HEALED {step.healingDetails?.confidence ? `(${step.healingDetails.confidence}%)` : ''}
              </span>
            );
          } else if (isFailed) {
            borderClass = 'border-red-500 bg-red-950/30 shadow-[0_0_20px_rgba(239,68,68,0.25)]';
            glowBadge = (
              <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-red-300 bg-red-500/20 px-2 py-0.5 rounded-full border border-red-500/40">
                <ShieldAlert className="w-3 h-3 text-red-400" />
                TRIAGED BUG
              </span>
            );
          } else if (isPassed) {
            borderClass = 'border-emerald-500/40 bg-obsidian-900/90';
            glowBadge = (
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> PASSED
              </span>
            );
          } else if (isRunning) {
            borderClass = 'border-cyan-500/60 bg-obsidian-900 animate-pulse';
            glowBadge = (
              <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" /> RUNNING
              </span>
            );
          }

          return (
            <motion.div
              key={step.order || idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
              onClick={() => onSelectStep && onSelectStep(step)}
              className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${borderClass} ${
                isSelected ? 'ring-2 ring-emerald-400' : ''
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-obsidian-800 border border-white/10 flex items-center justify-center text-xs font-mono text-slate-300 font-bold">
                    {step.order}
                  </div>
                  <ActionIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-bold text-white tracking-wide truncate max-w-[140px]">
                    {step.name}
                  </span>
                </div>
                {glowBadge}
              </div>

              {/* User Intent (The Core Contract) */}
              <div className="mb-2">
                <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                  <span className="text-slate-500 font-mono">Intent:</span> "{step.intent}"
                </p>
              </div>

              {/* Selector details */}
              <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-500 truncate max-w-[150px]">
                  {isHealed ? (
                    <span className="line-through text-red-400/80 mr-1.5">{step.originalSelector}</span>
                  ) : null}
                  <span className={isHealed ? 'text-emerald-300 font-semibold' : 'text-slate-300'}>
                    {step.resolvedSelector || step.originalSelector}
                  </span>
                </span>
                <span className="text-slate-400 text-[10px]">
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
