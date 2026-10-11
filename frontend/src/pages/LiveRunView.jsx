import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Zap, 
  Flame, 
  AlertTriangle, 
  Monitor, 
  CheckCircle2,
  Activity,
  ArrowRight,
  RotateCcw,
  Loader2
} from 'lucide-react';
import { useTests } from '../context/TestContext';
import IntentGraph from '../components/runner/IntentGraph';
import LiveTerminal from '../components/runner/LiveTerminal';
import DiffInspector from '../components/inspector/DiffInspector';

export default function LiveRunView() {
  const { tests, activeRun, setActiveRun, triggerRun, terminalLogs, clearLogs } = useTests();
  const [selectedStep, setSelectedStep] = useState(null);
  const [headless, setHeadless] = useState(true);
  const [isRunning, setIsRunning] = useState(false);

  const defaultTest = tests[0] || null;
  const stepsToDisplay = activeRun?.steps || defaultTest?.steps || [];

  // Automatically track currently running/healing step, and sync selectedStep with latest socket updates!
  useEffect(() => {
    if (stepsToDisplay.length > 0) {
      // If a step is actively running, healing, or has failed, auto-focus it!
      const activeStep = stepsToDisplay.find(s => s.status === 'healing' || s.status === 'running' || s.status === 'failed');
      
      if (activeStep) {
        setSelectedStep(activeStep);
      } else if (!selectedStep) {
        const latestHealed = stepsToDisplay.slice().reverse().find(s => s.status === 'healed') || stepsToDisplay[0];
        setSelectedStep(latestHealed);
      } else {
        // Keep selectedStep in sync with the latest updated data for that step
        const matchingStep = stepsToDisplay.find(s => s.order === selectedStep.order);
        if (matchingStep && (matchingStep.status !== selectedStep.status || matchingStep.resolvedSelector !== selectedStep.resolvedSelector)) {
          setSelectedStep(matchingStep);
        }
      }
    }
  }, [stepsToDisplay]);

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
    <div className="w-full max-w-6xl mx-auto px-6 py-8 space-y-6">
      {/* Top Controller Header */}
      <div className="card p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-card">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${activeRun?.status === 'running' ? 'bg-brand animate-pulse' : 'bg-success'}`}></span>
            <span className="text-xs font-mono text-brand uppercase font-bold tracking-wider">
              {activeRun?.status === 'running' ? 'Running Live Test' : 'Test Runner Ready'}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-ink">
            {activeRun?.testTitle || defaultTest?.title || 'E-Commerce End-to-End Test Suite'}
          </h1>
          <p className="text-xs text-ink-secondary">
            Target: <code className="text-ink font-mono bg-surface px-2 py-0.5 rounded border border-border text-xs font-semibold">{defaultTest?.targetUrl || 'http://localhost:5173/demo-store'}</code>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Visual Browser Checkbox */}
          <label 
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border text-xs font-mono cursor-pointer transition font-semibold ${
              !headless 
                ? 'bg-indigo-50 border-indigo-300 text-brand shadow-xs ring-1 ring-indigo-200' 
                : 'bg-surface border-border text-ink-secondary hover:bg-gray-100'
            }`}
            title="When ON: Launches a real Chromium browser window on your desktop so you can watch Playwright physically click buttons and fill inputs live!"
          >
            <Monitor className={`w-4 h-4 ${!headless ? 'text-brand' : 'text-ink-tertiary'}`} />
            <input
              type="checkbox"
              checked={!headless}
              onChange={(e) => setHeadless(!e.target.checked)}
              className="accent-brand rounded"
            />
            <span>{!headless ? 'Desktop Chrome Window: ON' : 'Desktop Window: OFF (Headless)'}</span>
          </label>

          <button
            onClick={() => handleExecute('mutated')}
            disabled={isRunning}
            className="btn btn-primary text-sm px-5 py-2.5 font-bold shadow-sm"
            title="Run test against mutated elements with auto-healing"
          >
            <Zap className={`w-4 h-4 fill-current ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Running...' : 'Auto-Heal Run'}</span>
          </button>

          <button
            onClick={() => handleExecute('standard')}
            disabled={isRunning}
            className="btn btn-secondary text-sm px-4 py-2.5 font-semibold"
            title="Run standard test"
          >
            <Play className="w-4 h-4 fill-current text-ink-secondary" />
            <span>Standard</span>
          </button>

          <button
            onClick={() => handleExecute('chaos')}
            disabled={isRunning}
            className="btn bg-amber-500 hover:bg-amber-600 text-white text-sm px-4 py-2.5 font-semibold shadow-sm"
            title="Randomize UI elements during run"
          >
            <Flame className="w-4 h-4" />
            <span>Chaos</span>
          </button>

          <button
            onClick={() => handleExecute('bug_mode')}
            disabled={isRunning}
            className="btn bg-danger hover:bg-red-700 text-white text-sm px-4 py-2.5 font-semibold shadow-sm"
            title="Trigger a genuine bug to test Smart Triage"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Real Bug</span>
          </button>

          {activeRun?.status === 'running' && (
            <button
              onClick={() => {
                setActiveRun(prev => prev ? { ...prev, status: 'completed' } : null);
                setIsRunning(false);
              }}
              className="btn btn-ghost btn-xs text-xs text-ink-secondary flex items-center gap-1 ml-1"
              title="Reset state if run was interrupted"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset State</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress & Live Telemetry Bar */}
      <div className="card p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm font-mono shadow-card">
        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-ink-secondary text-xs font-semibold">Mode:</span>
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
            <span className="text-ink-secondary text-xs font-semibold">Healed:</span>
            <span className="badge badge-success font-bold font-mono text-xs">
              {activeRun?.healedCount || 0} repaired
            </span>
          </div>

          {activeRun?.triageClassification && activeRun.triageClassification !== 'Clean' && (
            <div className="flex items-center gap-2">
              <span className="text-ink-secondary text-xs font-semibold">Triage:</span>
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
        <div className="flex items-center gap-3 w-full sm:w-60">
          <div className="flex-1 bg-gray-200 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-brand h-full rounded-full transition-all duration-300"
              style={{ width: `${percentComplete}%` }}
            ></div>
          </div>
          <span className="text-ink font-bold font-mono text-sm">{completedCount}/{total}</span>
        </div>
      </div>

      {/* Interactive Intent Graph */}
      <div className="card p-6 shadow-card">
        <IntentGraph
          steps={stepsToDisplay}
          selectedStep={selectedStep}
          onSelectStep={(step) => setSelectedStep(step)}
        />
      </div>

      {/* Split Details Section: Step Diff Inspector + Live Telemetry Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <div className="h-full">
          <DiffInspector 
            selectedStep={selectedStep || stepsToDisplay[0]} 
            steps={stepsToDisplay}
            onSelectStep={(step) => setSelectedStep(step)}
          />
        </div>

        <div className="h-full">
          <LiveTerminal logs={terminalLogs} onClear={clearLogs} />
        </div>
      </div>
    </div>
  );
}
