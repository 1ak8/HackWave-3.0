import React, { useState } from 'react';
import { 
  Play, 
  Zap, 
  Flame, 
  AlertTriangle, 
  Monitor, 
  ExternalLink, 
  RotateCcw,
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useTests } from '../context/TestContext';
import IntentGraph from '../components/runner/IntentGraph';
import LiveTerminal from '../components/runner/LiveTerminal';
import DiffInspector from '../components/inspector/DiffInspector';

export default function LiveRunView() {
  const { tests, activeRun, triggerRun, terminalLogs, clearLogs } = useTests();
  const [selectedStep, setSelectedStep] = useState(null);
  const [headless, setHeadless] = useState(true);
  const [isRunning, setIsRunning] = useState(false);

  const defaultTest = tests[0] || null;

  const handleExecute = async (mode) => {
    setIsRunning(true);
    setSelectedStep(null);
    try {
      await triggerRun(defaultTest?._id, mode, headless);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunning(false);
    }
  };

  const stepsToDisplay = activeRun?.steps || defaultTest?.steps || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Controller Bar */}
      <div className="bg-obsidian-900 border border-white/10 rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-mono text-emerald-400 uppercase font-semibold">Active Run Orchestrator</span>
            <span className="text-xs text-slate-500 font-mono">• {activeRun?._id || 'Ready'}</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            {activeRun?.testTitle || defaultTest?.title || 'E-Commerce End-to-End Test Suite'}
          </h2>
          <p className="text-xs text-slate-400">
            Target: <code className="text-slate-300 font-mono">{defaultTest?.targetUrl || 'http://localhost:5173/demo-store'}</code>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Headless Toggle */}
          <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-obsidian-850 border border-white/10 text-xs font-mono text-slate-300 cursor-pointer hover:bg-obsidian-800 transition">
            <Monitor className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="checkbox"
              checked={!headless}
              onChange={(e) => setHeadless(!e.target.checked)}
              className="accent-emerald-500 rounded"
            />
            <span>Visual Browser Window</span>
          </label>

          <button
            onClick={() => handleExecute('standard')}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-obsidian-950 font-bold text-xs transition shadow-[0_0_15px_rgba(16,185,129,0.25)] disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Version A</span>
          </button>

          <button
            onClick={() => handleExecute('mutated')}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-obsidian-950 font-bold text-xs transition shadow-[0_0_15px_rgba(245,158,11,0.25)] disabled:opacity-50"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Version B (Heal)</span>
          </button>

          <button
            onClick={() => handleExecute('chaos')}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-crimson-accent hover:bg-red-500 text-white font-bold text-xs transition shadow-[0_0_15px_rgba(239,68,68,0.25)] disabled:opacity-50"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Chaos Mode</span>
          </button>

          <button
            onClick={() => handleExecute('bug_mode')}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-950 hover:bg-red-900 border border-red-500/30 text-red-300 font-bold text-xs transition disabled:opacity-50"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span>Real Bug</span>
          </button>
        </div>
      </div>

      {/* Feature 2: Intent Graph Node Flow */}
      <div className="bg-obsidian-900 border border-white/10 rounded-2xl p-6 shadow-xl">
        <IntentGraph
          steps={stepsToDisplay}
          selectedStep={selectedStep}
          onSelectStep={(step) => setSelectedStep(step)}
        />
      </div>

      {/* Split Details Section: Step Diff Inspector + Live Telemetry Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Step Inspector & AI Rationale Card */}
        <div className="h-full">
          <DiffInspector selectedStep={selectedStep || stepsToDisplay[0]} />
        </div>

        {/* Live Playwright Console Terminal */}
        <div className="h-full">
          <LiveTerminal logs={terminalLogs} onClear={clearLogs} />
        </div>
      </div>
    </div>
  );
}
