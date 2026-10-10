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
    <div className="w-full max-w-7xl mx-auto px-6 py-6 space-y-5">
      {/* Top Controller Header */}
      <div className="card p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${activeRun?.status === 'running' ? 'bg-brand animate-pulse' : 'bg-success'}`}></span>
            <span className="text-2xs font-mono text-brand uppercase font-bold tracking-wider">
              Autonomous Orchestrator
            </span>
            <span className="text-2xs text-ink-tertiary font-mono">• ID: {activeRun?._id ? String(activeRun._id).substring(0, 10) : 'Ready'}</span>
          </div>
          <h1 className="text-xl font-bold text-ink mt-1">
            {activeRun?.testTitle || defaultTest?.title || 'E-Commerce End-to-End Test Suite'}
          </h1>
          <p className="text-xs text-ink-secondary mt-0.5">
            Target Endpoint: <code className="text-ink font-mono bg-surface px-1.5 py-0.5 rounded border border-border text-2xs">{defaultTest?.targetUrl || 'http://localhost:5173/demo-store'}</code>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Visual Browser Checkbox */}
          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface text-xs font-mono text-ink-secondary cursor-pointer hover:bg-gray-100 transition">
            <Monitor className="w-3.5 h-3.5 text-ink-tertiary" />
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
            className="btn btn-secondary btn-sm"
          >
            <Play className="w-3.5 h-3.5 fill-current text-ink-secondary" />
            <span>Version A</span>
          </button>

          <button
            onClick={() => handleExecute('mutated')}
            disabled={isRunning || activeRun?.status === 'running'}
            className="btn btn-primary btn-sm"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Version B (Heal)</span>
          </button>

          <button
            onClick={() => handleExecute('chaos')}
            disabled={isRunning || activeRun?.status === 'running'}
            className="btn btn-sm bg-amber-500 hover:bg-amber-600 text-white shadow-sm"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Chaos Mode</span>
          </button>

          <button
            onClick={() => handleExecute('bug_mode')}
            disabled={isRunning || activeRun?.status === 'running'}
            className="btn btn-sm bg-danger hover:bg-red-700 text-white shadow-sm"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Real Bug</span>
          </button>
        </div>
      </div>

      {/* Progress & Live Telemetry Bar */}
      <div className="card p-3.5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-ink-secondary text-2xs uppercase tracking-wider">Mode:</span>
            <span className={`badge ${
              activeRun?.mode === 'chaos' ? 'badge-warning' :
              activeRun?.mode === 'mutated' ? 'badge-brand' :
              activeRun?.mode === 'bug_mode' ? 'badge-danger' :
              'badge-neutral'
            }`}>
              {activeRun?.mode || 'standard'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-ink-secondary text-2xs uppercase tracking-wider">Healed:</span>
            <span className="badge badge-success font-bold font-mono">
              {activeRun?.healedCount || 0} repaired
            </span>
          </div>

          {activeRun?.triageClassification && activeRun.triageClassification !== 'Clean' && (
            <div className="flex items-center gap-2">
              <span className="text-ink-secondary text-2xs uppercase tracking-wider">Triage:</span>
              <span className={`badge ${
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
        <div className="flex items-center gap-3 w-full sm:w-56">
          <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-brand h-full rounded-full transition-all duration-300"
              style={{ width: `${percentComplete}%` }}
            ></div>
          </div>
          <span className="text-ink font-bold font-mono text-xs">{completedCount}/{total}</span>
        </div>
      </div>

      {/* Feature 2: Interactive Intent Graph */}
      <div className="card p-5">
        <IntentGraph
          steps={stepsToDisplay}
          selectedStep={selectedStep}
          onSelectStep={(step) => setSelectedStep(step)}
        />
      </div>

      {/* Split Details Section: Step Diff Inspector + Live Telemetry Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
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
