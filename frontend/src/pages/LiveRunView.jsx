import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Zap, 
  Flame, 
  AlertTriangle, 
  Monitor, 
  Sparkles,
  CheckCircle2,
  ExternalLink
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

  const total = stepsToDisplay.length || 6;
  const completedCount = stepsToDisplay.filter(s => s.status === 'passed' || s.status === 'healed').length;
  const percentComplete = Math.round((completedCount / total) * 100);

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 space-y-6">
      {/* Top Controller Header (Apple Frosted Glass) */}
      <div className="bg-white/80 backdrop-blur-2xl border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-apple-card flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${activeRun?.status === 'running' ? 'bg-apple-blue animate-pulse' : 'bg-apple-green'}`}></span>
            <span className="text-xs font-mono text-apple-blue uppercase font-bold tracking-wider">
              Autonomous Orchestrator
            </span>
            <span className="text-xs text-apple-secondary font-mono">• {activeRun?._id || 'Ready'}</span>
          </div>
          <h1 className="text-2xl font-bold text-apple-text mt-1">
            {activeRun?.testTitle || defaultTest?.title || 'E-Commerce End-to-End Test Suite'}
          </h1>
          <p className="text-xs text-apple-secondary mt-0.5">
            Target Endpoint: <code className="text-apple-text font-mono bg-black/[0.04] px-2 py-0.5 rounded-md">{defaultTest?.targetUrl || 'http://localhost:5173/demo-store'}</code>
          </p>
        </div>

        {/* Action Trigger Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Visual Browser Window Checkbox */}
          <label className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-black/[0.03] border border-black/[0.06] text-xs font-mono text-apple-secondary cursor-pointer hover:bg-black/[0.05] transition mr-1 font-medium">
            <Monitor className="w-3.5 h-3.5 text-apple-secondary" />
            <input
              type="checkbox"
              checked={!headless}
              onChange={(e) => setHeadless(!e.target.checked)}
              className="accent-apple-blue rounded"
            />
            <span>Visual Window</span>
          </label>

          <button
            onClick={() => handleExecute('standard')}
            disabled={isRunning || activeRun?.status === 'running'}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-apple-text hover:bg-black text-white font-semibold text-xs transition shadow-sm active:scale-95 disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Version A</span>
          </button>

          <button
            onClick={() => handleExecute('mutated')}
            disabled={isRunning || activeRun?.status === 'running'}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-apple-blue hover:bg-apple-blue-hover text-white font-semibold text-xs transition shadow-sm active:scale-95 disabled:opacity-50"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Version B (Heal)</span>
          </button>

          <button
            onClick={() => handleExecute('chaos')}
            disabled={isRunning || activeRun?.status === 'running'}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-apple-orange hover:bg-amber-600 text-white font-semibold text-xs transition shadow-sm active:scale-95 disabled:opacity-50"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Chaos Mode</span>
          </button>

          <button
            onClick={() => handleExecute('bug_mode')}
            disabled={isRunning || activeRun?.status === 'running'}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white hover:bg-apple-red/5 border border-black/[0.08] text-apple-red font-semibold text-xs transition active:scale-95 disabled:opacity-50"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Real Bug</span>
          </button>
        </div>
      </div>

      {/* Progress & Live Telemetry Bar */}
      <div className="bg-white/80 backdrop-blur-xl border border-black/[0.06] rounded-2xl p-4 shadow-apple-card flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-apple-secondary">Run Mode:</span>
            <span className={`px-2.5 py-0.5 rounded-full font-semibold uppercase ${
              activeRun?.mode === 'chaos' ? 'bg-apple-orange-light text-apple-orange border border-apple-orange/20' :
              activeRun?.mode === 'mutated' ? 'bg-apple-blue-light text-apple-blue border border-apple-blue/20' :
              activeRun?.mode === 'bug_mode' ? 'bg-apple-red-light text-apple-red border border-apple-red/20' :
              'bg-black/[0.04] text-apple-secondary'
            }`}>
              {activeRun?.mode || 'standard'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-apple-secondary">Healed Mutations:</span>
            <span className="text-apple-green font-bold bg-apple-green-light px-2 py-0.5 rounded-full border border-apple-green/20">
              {activeRun?.healedCount || 0}
            </span>
          </div>

          {activeRun?.triageClassification && activeRun.triageClassification !== 'Clean' && (
            <div className="flex items-center gap-2">
              <span className="text-apple-secondary">Triage:</span>
              <span className={`px-2.5 py-0.5 rounded-full font-bold ${
                activeRun.triageClassification === 'Genuine_Bug_Halted' 
                  ? 'bg-apple-red-light text-apple-red border border-apple-red/30' 
                  : 'bg-apple-green-light text-apple-green border border-apple-green/30'
              }`}>
                {activeRun.triageClassification}
              </span>
            </div>
          )}
        </div>

        {/* Apple Pill Progress Bar */}
        <div className="flex items-center gap-3 w-full sm:w-64">
          <div className="flex-1 bg-black/[0.05] h-2 rounded-full overflow-hidden">
            <div 
              className="bg-apple-blue h-full rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${percentComplete}%` }}
            ></div>
          </div>
          <span className="text-apple-text font-bold">{completedCount}/{total}</span>
        </div>
      </div>

      {/* Feature 2: Interactive Intent Graph */}
      <div className="bg-white/80 backdrop-blur-2xl border border-black/[0.06] rounded-3xl p-6 shadow-apple-card">
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
