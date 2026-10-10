import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Zap, 
  Flame, 
  AlertTriangle, 
  Monitor, 
  CheckCircle2,
  Activity,
  Layers,
  ArrowRight
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
    <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 py-8 space-y-6">
      {/* Top Controller Header */}
      <div className="card p-6 sm:p-7 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-card">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <span className={`w-2.5 h-2.5 rounded-full ${activeRun?.status === 'running' ? 'bg-brand animate-pulse' : 'bg-success'}`}></span>
            <span className="text-xs font-mono text-brand uppercase font-bold tracking-wider">
              Autonomous Orchestrator
            </span>
            <span className="text-xs text-ink-tertiary font-mono">• Run ID: {activeRun?._id ? String(activeRun._id).substring(0, 12) : 'Ready'}</span>
          </div>
          <h1 className="text-2xl font-bold text-ink tracking-tight">
            {activeRun?.testTitle || defaultTest?.title || 'E-Commerce End-to-End Test Suite'}
          </h1>
          <p className="text-sm text-ink-secondary">
            Target Endpoint: <code className="text-ink font-mono bg-surface px-2 py-1 rounded border border-border text-xs font-semibold">{defaultTest?.targetUrl || 'http://localhost:5173/demo-store'}</code>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Visual Browser Checkbox */}
          <label className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg border border-border bg-surface text-sm font-mono text-ink-secondary cursor-pointer hover:bg-gray-100 transition font-medium">
            <Monitor className="w-4 h-4 text-ink-tertiary" />
            <input
              type="checkbox"
              checked={!headless}
              onChange={(e) => setHeadless(!e.target.checked)}
              className="accent-brand rounded"
            />
            <span>Visual Window</span>
          </label>

          <button
            onClick={() => handleExecute('standard')}
            disabled={isRunning || activeRun?.status === 'running'}
            className="btn btn-secondary text-sm px-4 py-2.5"
          >
            <Play className="w-4 h-4 fill-current text-ink-secondary" />
            <span>Version A</span>
          </button>

          <button
            onClick={() => handleExecute('mutated')}
            disabled={isRunning || activeRun?.status === 'running'}
            className="btn btn-primary text-sm px-5 py-2.5"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Version B (Heal)</span>
          </button>

          <button
            onClick={() => handleExecute('chaos')}
            disabled={isRunning || activeRun?.status === 'running'}
            className="btn bg-amber-500 hover:bg-amber-600 text-white text-sm px-4 py-2.5 shadow-sm"
          >
            <Flame className="w-4 h-4" />
            <span>Chaos Mode</span>
          </button>

          <button
            onClick={() => handleExecute('bug_mode')}
            disabled={isRunning || activeRun?.status === 'running'}
            className="btn bg-danger hover:bg-red-700 text-white text-sm px-4 py-2.5 shadow-sm"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Real Bug</span>
          </button>
        </div>
      </div>

      {/* Progress & Live Telemetry Bar */}
      <div className="card p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-5 text-sm font-mono shadow-card">
        <div className="flex flex-wrap items-center gap-5 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-ink-secondary text-xs uppercase tracking-wider font-semibold">Mode:</span>
            <span className={`badge text-xs font-bold ${
              activeRun?.mode === 'chaos' ? 'badge-warning' :
              activeRun?.mode === 'mutated' ? 'badge-brand' :
              activeRun?.mode === 'bug_mode' ? 'badge-danger' :
              'badge-neutral'
            }`}>
              {activeRun?.mode || 'standard'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-ink-secondary text-xs uppercase tracking-wider font-semibold">Healed:</span>
            <span className="badge badge-success font-bold font-mono text-xs">
              {activeRun?.healedCount || 0} repaired
            </span>
          </div>

          {activeRun?.triageClassification && activeRun.triageClassification !== 'Clean' && (
            <div className="flex items-center gap-2">
              <span className="text-ink-secondary text-xs uppercase tracking-wider font-semibold">Triage:</span>
              <span className={`badge text-xs font-bold ${
                activeRun.triageClassification === 'Genuine_Bug_Halted' 
                  ? 'badge-danger' 
                  : 'badge-success'
              }`}>
                {activeRun.triageClassification}
              </span>
            </div>
          )}
        </div>

        {/* Clean Progress Bar */}
        <div className="flex items-center gap-4 w-full sm:w-64">
          <div className="flex-1 bg-gray-200 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-brand h-full rounded-full transition-all duration-300"
              style={{ width: `${percentComplete}%` }}
            ></div>
          </div>
          <span className="text-ink font-bold font-mono text-sm">{completedCount}/{total}</span>
        </div>
      </div>

      {/* Feature 2: Interactive Intent Graph */}
      <div className="card p-7 shadow-card">
        <IntentGraph
          steps={stepsToDisplay}
          selectedStep={selectedStep}
          onSelectStep={(step) => setSelectedStep(step)}
        />
      </div>

      {/* Split Details Section: Step Diff Inspector + Live Telemetry Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <div className="h-full">
          <DiffInspector selectedStep={selectedStep || stepsToDisplay[0]} />
        </div>

        <div className="h-full">
          <LiveTerminal logs={terminalLogs} onClear={clearLogs} />
        </div>
      </div>
    </div>
  );
}
