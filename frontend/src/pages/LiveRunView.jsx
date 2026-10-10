import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Zap, 
  Flame, 
  AlertTriangle, 
  Monitor, 
  RotateCcw,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Layers
} from 'lucide-react';
import { useTests } from '../context/TestContext';
import IntentGraph from '../components/runner/IntentGraph';
import LiveTerminal from '../components/runner/LiveTerminal';
import DiffInspector from '../components/inspector/DiffInspector';

export default function LiveRunView() {
  const { tests, activeRun, triggerRun, terminalLogs, clearLogs, refreshAll } = useTests();
  const [selectedStep, setSelectedStep] = useState(null);
  const [headless, setHeadless] = useState(true);
  const [isRunning, setIsRunning] = useState(false);

  const defaultTest = tests[0] || null;
  const stepsToDisplay = activeRun?.steps || defaultTest?.steps || [];

  // Auto-select latest active or healed step if none selected
  useEffect(() => {
    if (!selectedStep && stepsToDisplay.length > 0) {
      const activeOrHealed = stepsToDisplay.find(s => s.status === 'healing' || s.status === 'healed' || s.status === 'failed') || stepsToDisplay[0];
      setSelectedStep(activeOrHealed);
    }
  }, [stepsToDisplay, selectedStep]);

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

  // Calculate progress stats
  const total = stepsToDisplay.length || 6;
  const completedCount = stepsToDisplay.filter(s => s.status === 'passed' || s.status === 'healed').length;
  const percentComplete = Math.round((completedCount / total) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Controller Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${activeRun?.status === 'running' ? 'bg-brand-600 animate-pulse' : 'bg-emerald-500'}`}></span>
            <span className="text-xs font-mono text-brand-700 uppercase font-bold tracking-wider">
              Autonomous Orchestrator
            </span>
            <span className="text-xs text-slate-400 font-mono">• {activeRun?._id || 'Ready'}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            {activeRun?.testTitle || defaultTest?.title || 'E-Commerce End-to-End Test Suite'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Target Endpoint: <code className="text-slate-800 font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{defaultTest?.targetUrl || 'http://localhost:5173/demo-store'}</code>
          </p>
        </div>

        {/* Action Trigger Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Visual Browser Headless Checkbox */}
          <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 cursor-pointer hover:bg-slate-100 transition mr-1 font-medium">
            <Monitor className="w-3.5 h-3.5 text-slate-500" />
            <input
              type="checkbox"
              checked={!headless}
              onChange={(e) => setHeadless(!e.target.checked)}
              className="accent-brand-600 rounded"
            />
            <span>Visual Window</span>
          </label>

          <button
            onClick={() => handleExecute('standard')}
            disabled={isRunning || activeRun?.status === 'running'}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-sm disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Version A</span>
          </button>

          <button
            onClick={() => handleExecute('mutated')}
            disabled={isRunning || activeRun?.status === 'running'}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs transition shadow-md shadow-brand-500/20 disabled:opacity-50"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Version B (Heal)</span>
          </button>

          <button
            onClick={() => handleExecute('chaos')}
            disabled={isRunning || activeRun?.status === 'running'}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition shadow-md shadow-rose-500/20 disabled:opacity-50"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Chaos Mode</span>
          </button>

          <button
            onClick={() => handleExecute('bug_mode')}
            disabled={isRunning || activeRun?.status === 'running'}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-red-50 border border-red-300 text-red-700 font-bold text-xs transition disabled:opacity-50"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
            <span>Real Bug</span>
          </button>
        </div>
      </div>

      {/* Progress & Live Telemetry Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Run Mode:</span>
            <span className={`px-2 py-0.5 rounded font-bold uppercase ${
              activeRun?.mode === 'chaos' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
              activeRun?.mode === 'mutated' ? 'bg-brand-50 text-brand-700 border border-brand-200' :
              activeRun?.mode === 'bug_mode' ? 'bg-red-50 text-red-700 border border-red-200' :
              'bg-slate-100 text-slate-700'
            }`}>
              {activeRun?.mode || 'standard'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">Healed Mutations:</span>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {activeRun?.healedCount || 0}
            </span>
          </div>

          {activeRun?.triageClassification && activeRun.triageClassification !== 'Clean' && (
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Triage:</span>
              <span className={`px-2 py-0.5 rounded font-bold ${
                activeRun.triageClassification === 'Genuine_Bug_Halted' 
                  ? 'bg-red-100 text-red-800 border border-red-300' 
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}>
                {activeRun.triageClassification}
              </span>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-3 w-full sm:w-64">
          <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
            <div 
              className="bg-brand-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${percentComplete}%` }}
            ></div>
          </div>
          <span className="text-slate-700 font-bold">{completedCount}/{total}</span>
        </div>
      </div>

      {/* Feature 2: Interactive Intent Graph */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <IntentGraph
          steps={stepsToDisplay}
          selectedStep={selectedStep}
          onSelectStep={(step) => setSelectedStep(step)}
        />
      </div>

      {/* Split Details Section: Step Diff Inspector + Live Playwright Terminal */}
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
