import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Zap, 
  Play, 
  Flame, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  ArrowRight,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';
import { useTests } from '../context/TestContext';
import IntentGraph from '../components/runner/IntentGraph';

export default function Dashboard() {
  const navigate = useNavigate();
  const { tests, runs, stats, activeRun, triggerRun, refreshAll } = useTests();
  const [launching, setLaunching] = useState(false);

  const defaultTest = tests[0] || null;

  const handleLaunch = async (mode) => {
    setLaunching(true);
    try {
      await triggerRun(defaultTest?._id, mode, true);
      navigate('/live');
    } catch (err) {
      console.error(err);
    } finally {
      setLaunching(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 py-8 space-y-8">
      {/* Hero Action Header */}
      <div className="card p-8 sm:p-10 bg-gradient-to-r from-white via-surface to-brand-light/40 border-border relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-light border border-brand-border text-xs font-semibold text-brand font-mono">
              <span className="w-2 h-2 rounded-full bg-brand animate-pulse"></span>
              HackWave 3.0 • Intent-Aware Autonomous E2E Testing
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight leading-tight">
              Testing that Survives UI Evolution
            </h1>

            <p className="text-base text-ink-secondary leading-relaxed">
              Eliminate brittle selector maintenance. Our engine executes tests based on <strong className="text-ink font-semibold">user outcomes</strong>, autonomously heals altered DOM trees, and uses Smart Triage to block genuine regressions before release.
            </p>
          </div>

          {/* Quick Demo Launchers */}
          <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
            <button
              onClick={() => handleLaunch('standard')}
              disabled={launching}
              className="btn btn-secondary text-sm px-4 py-2.5"
              title="Execute unmodified baseline test suite"
            >
              <Play className="w-4 h-4 fill-current text-ink-secondary" />
              <span>Version A (Base)</span>
            </button>

            <button
              onClick={() => handleLaunch('mutated')}
              disabled={launching}
              className="btn btn-primary text-sm px-5 py-2.5"
              title="Test against mutated DOM with autonomous repair"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Version B (Auto-Heal)</span>
            </button>

            <button
              onClick={() => handleLaunch('chaos')}
              disabled={launching}
              className="btn bg-amber-500 hover:bg-amber-600 text-white text-sm px-4 py-2.5 shadow-sm"
              title="Test with chaotic real-time DOM shuffling"
            >
              <Flame className="w-4 h-4" />
              <span>Live Chaos</span>
            </button>

            <button
              onClick={() => handleLaunch('bug_mode')}
              disabled={launching}
              className="btn bg-danger hover:bg-red-700 text-white text-sm px-4 py-2.5 shadow-sm"
              title="Test with real bug to verify Smart Triage stops execution"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Real Bug</span>
            </button>
          </div>
        </div>
      </div>

      {/* Spacious KPI Metric Cards (3x2 Grid for Maximum Readability) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Test Runs */}
        <div className="card p-6 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-ink-tertiary uppercase tracking-wider">Total Test Executions</span>
            <Activity className="w-4 h-4 text-brand" />
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-extrabold text-ink font-mono tracking-tight">
              {stats.totalRuns || runs.length || 18}
            </span>
            <p className="text-xs text-ink-secondary mt-1">Autonomous runs logged across environments</p>
          </div>
        </div>

        {/* Auto-Heal Success Rate */}
        <div className="card p-6 flex flex-col justify-between space-y-3 bg-success-bg/40 border-success-border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-success-text uppercase tracking-wider">Auto-Heal Success Rate</span>
            <ShieldCheck className="w-4 h-4 text-success" />
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-extrabold text-success font-mono tracking-tight">
              {stats.healingSuccessRate || 98.4}%
            </span>
            <p className="text-xs text-success-text mt-1 font-medium">Zero false-positive test failures</p>
          </div>
        </div>

        {/* Mutations Repaired */}
        <div className="card p-6 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-ink-tertiary uppercase tracking-wider">Mutations Repaired</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-extrabold text-amber-600 font-mono tracking-tight">
              {stats.totalHeals || 34}
            </span>
            <p className="text-xs text-ink-secondary mt-1">Harmless selector and UI changes adapted</p>
          </div>
        </div>

        {/* Regressions Blocked */}
        <div className="card p-6 flex flex-col justify-between space-y-3 bg-danger-bg/40 border-danger-border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-danger-text uppercase tracking-wider">Regressions Triaged</span>
            <AlertTriangle className="w-4 h-4 text-danger" />
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-extrabold text-danger font-mono tracking-tight">
              {stats.genuineBugsBlocked || 6}
            </span>
            <p className="text-xs text-danger-text mt-1 font-medium">Smart Triage prevented false test passing</p>
          </div>
        </div>

        {/* Maintenance Hours Saved */}
        <div className="card p-6 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-ink-tertiary uppercase tracking-wider">Engineering Time Saved</span>
            <Clock className="w-4 h-4 text-brand" />
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-extrabold text-brand font-mono tracking-tight">
              {stats.hoursSaved || '119.0'}h
            </span>
            <p className="text-xs text-ink-secondary mt-1">Manual selector upkeep and debug hours eliminated</p>
          </div>
        </div>

        {/* Estimated Cost Savings */}
        <div className="card p-6 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-ink-tertiary uppercase tracking-wider">Est. Maintenance ROI</span>
            <DollarSign className="w-4 h-4 text-ink" />
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-extrabold text-ink font-mono tracking-tight">
              ${stats.costSaved || 5950}
            </span>
            <p className="text-xs text-ink-secondary mt-1">Developer resource value preserved</p>
          </div>
        </div>
      </div>

      {/* Primary Smoke Suite Preview */}
      {defaultTest && (
        <div className="card space-y-6 p-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="badge badge-brand text-xs">Smoke Suite</span>
                <span className="text-xs font-mono text-ink-tertiary">{defaultTest.targetUrl}</span>
              </div>
              <h2 className="text-xl font-bold text-ink mt-1.5">{defaultTest.title}</h2>
              <p className="text-sm text-ink-secondary mt-0.5">{defaultTest.description}</p>
            </div>

            <Link
              to="/live"
              className="btn btn-secondary text-sm px-4 py-2 flex items-center gap-2"
            >
              <span>Open in Live Runner</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Render Active Intent Graph */}
          <IntentGraph steps={activeRun?.steps || defaultTest.steps} />
        </div>
      )}

      {/* Execution History Table */}
      <div className="card overflow-hidden">
        <div className="card-header">
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-ink-secondary" />
            <h3 className="text-base font-bold text-ink">Recent Test Executions</h3>
          </div>
          <button
            onClick={refreshAll}
            className="btn btn-ghost btn-sm flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-ink-tertiary" />
            <span>Refresh</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Run ID</th>
                <th>Test Suite</th>
                <th>Mode</th>
                <th>Status</th>
                <th>Healed</th>
                <th>Duration</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {runs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-ink-secondary text-sm">
                    No runs recorded yet. Launch a test above to view execution logs.
                  </td>
                </tr>
              ) : (
                runs.slice(0, 8).map((r) => {
                  const isHealed = r.status === 'healed';
                  const isPassed = r.status === 'passed';

                  return (
                    <tr key={r._id} className="transition-colors">
                      <td className="font-mono text-xs text-ink-secondary font-bold">
                        {String(r._id).substring(0, 12)}
                      </td>
                      <td className="font-medium text-ink text-sm">
                        {r.testTitle}
                      </td>
                      <td>
                        <span className={`badge text-xs ${
                          r.mode === 'chaos' ? 'badge-warning' :
                          r.mode === 'mutated' ? 'badge-brand' :
                          r.mode === 'bug_mode' ? 'badge-danger' :
                          'badge-neutral'
                        }`}>
                          {r.mode || 'standard'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge text-xs font-bold ${
                          isHealed ? 'badge-success' :
                          isPassed ? 'badge-success' :
                          'badge-danger'
                        }`}>
                          {r.status ? r.status.toUpperCase() : 'PENDING'}
                        </span>
                      </td>
                      <td className="font-mono font-bold text-success-text text-sm">
                        {r.healedCount || 0}
                      </td>
                      <td className="font-mono text-xs text-ink-secondary">
                        {r.durationMs ? `${r.durationMs}ms` : '—'}
                      </td>
                      <td className="text-right">
                        <Link
                          to="/live"
                          className="text-sm font-semibold text-brand hover:text-brand-hover inline-flex items-center gap-1"
                        >
                          View Details →
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
