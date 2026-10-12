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

  const defaultTest = tests.find(t => t._id === 'test_default_ecommerce_flow' || t.isSample || t.steps?.length === 6) || tests[0] || null;
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
      await triggerRun(defaultTest?._id, mode, headless, { targetUrl: `${window.location.origin}/demo-store` });
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
      <div className="card p-4 sm:p-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4 shadow-card">
        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${activeRun?.status === 'running' ? 'bg-[#9a6700] animate-pulse' : 'bg-[#1a7f37]'}`}></span>
            <span className="text-2xs font-mono text-ink-secondary uppercase font-semibold tracking-wider">
              {activeRun?.status === 'running' ? 'Workflow Executing...' : 'Runner Ready'}
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-ink truncate">
            {activeRun?.testTitle || defaultTest?.title || 'E-Commerce End-to-End Test Suite'}
          </h1>
          <p className="text-xs text-ink-secondary truncate flex items-center gap-1.5">
            <span className="text-ink-tertiary text-2xs font-mono">Target:</span>
            <code className="text-ink font-mono bg-surface px-1.5 py-0.5 rounded border border-border text-2xs truncate">
              {defaultTest?.targetUrl || 'http://localhost:5173/demo-store'}
            </code>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {/* Visual Browser Checkbox */}
          <label 
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-2xs font-mono cursor-pointer transition select-none whitespace-nowrap shrink-0 ${
              !headless 
                ? 'bg-[#ddf4ff] border-[#54aeff] text-[#0969da]' 
                : 'bg-surface border-border text-ink-secondary hover:bg-surface-raised'
            }`}
            title="When ON: Launches a real Chromium browser window on your desktop so you can watch Playwright physically click buttons and fill inputs live!"
          >
            <Monitor className={`w-3.5 h-3.5 ${!headless ? 'text-accent' : 'text-ink-tertiary'}`} />
            <input
              type="checkbox"
              checked={!headless}
              onChange={(e) => setHeadless(!e.target.checked)}
              className="accent-[#0969da] rounded w-3 h-3"
            />
            <span>{!headless ? 'Desktop Chrome: ON' : 'Desktop: OFF'}</span>
          </label>

          <button
            onClick={() => handleExecute('mutated')}
            disabled={isRunning}
            className="btn btn-primary btn-sm px-3.5 py-1.5 text-xs font-medium whitespace-nowrap shrink-0"
            title="Run test against mutated elements with auto-healing"
          >
            <Zap className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Running...' : 'Auto-Heal Run'}</span>
          </button>

          <button
            onClick={() => handleExecute('standard')}
            disabled={isRunning}
            className="btn btn-secondary btn-sm px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0"
            title="Run standard test"
          >
            <Play className="w-3.5 h-3.5 fill-current text-ink-secondary" />
            <span>Standard</span>
          </button>

          <button
            onClick={() => handleExecute('chaos')}
            disabled={isRunning}
            className="btn btn-secondary btn-sm px-3 py-1.5 text-xs font-medium text-[#9a6700] hover:bg-[#fff8c5] border-[#d4a72c] whitespace-nowrap shrink-0 flex items-center gap-1"
            title="Randomize UI elements during run"
          >
            <Flame className="w-3.5 h-3.5 text-[#9a6700]" />
            <span>Chaos</span>
          </button>

          <button
            onClick={() => handleExecute('bug_mode')}
            disabled={isRunning}
            className="btn btn-secondary btn-sm px-3 py-1.5 text-xs font-medium text-[#cf222e] hover:bg-[#ffebe9] border-[#ff8182] whitespace-nowrap shrink-0 flex items-center gap-1"
            title="Trigger a genuine bug to test Smart Triage"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-[#cf222e]" />
            <span>Real Bug</span>
          </button>

          {activeRun?.status === 'running' && (
            <button
              onClick={() => {
                setActiveRun(prev => prev ? { ...prev, status: 'completed' } : null);
                setIsRunning(false);
              }}
              className="btn btn-ghost btn-xs text-2xs text-ink-secondary flex items-center gap-1 ml-1"
              title="Reset state if run was interrupted"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress & Live Telemetry Bar */}
      <div className="card p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono shadow-card">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1.5">
            <span className="text-ink-secondary text-xs">Mode:</span>
            <span className={`badge text-2xs font-mono ${
              activeRun?.mode === 'chaos' ? 'badge-warning' :
              activeRun?.mode === 'mutated' ? 'badge-info' :
              activeRun?.mode === 'bug_mode' ? 'badge-danger' :
              'badge-neutral'
            }`}>
              {activeRun?.mode || 'standard'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-ink-secondary text-xs">Healed:</span>
            <span className="badge badge-success font-mono text-2xs">
              {activeRun?.healedCount || 0} repaired
            </span>
          </div>

          {activeRun?.triageClassification && activeRun.triageClassification !== 'Clean' && (
            <div className="flex items-center gap-1.5">
              <span className="text-ink-secondary text-xs">Triage:</span>
              <span className={`badge text-2xs font-mono ${
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
        <div className="flex items-center gap-2.5 w-full sm:w-56">
          <div className="flex-1 bg-border h-2 rounded-full overflow-hidden">
            <div 
              className="bg-[#1a7f37] h-full rounded-full transition-all duration-300"
              style={{ width: `${percentComplete}%` }}
            ></div>
          </div>
          <span className="text-ink font-semibold font-mono text-xs">{completedCount}/{total}</span>
        </div>
      </div>

      {/* Interactive Intent Graph */}
      <div className="card p-5 shadow-card">
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
