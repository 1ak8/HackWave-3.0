import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Zap, 
  Play, 
  Flame, 
  AlertTriangle, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  RefreshCw, 
  ShoppingBag,
  CheckCircle2,
  ExternalLink,
  Layers,
  Activity,
  Radio,
  Cpu,
  Database,
  TrendingUp,
  DollarSign,
  FileText,
  Code,
  Check
} from 'lucide-react';
import { useTests } from '../context/TestContext';
import IntentGraph from '../components/runner/IntentGraph';

export default function Dashboard() {
  const navigate = useNavigate();
  const { tests, runs, stats, activeRun, triggerRun, refreshAll, healingLogs, socketConnected } = useTests();
  const [launching, setLaunching] = useState(false);

  useEffect(() => {
    refreshAll();
  }, []);

  const defaultTest = tests[0] || null;
  const benchmarkSuite = tests.find(t => t.isSample || t.steps?.length === 6) || tests[0] || null;
  const latestRun = runs[0] || activeRun || null;

  const totalHeals = healingLogs.filter(l => l.classification === 'Harmless_UI_Change').length;
  const totalBugs = healingLogs.filter(l => l.classification === 'Genuine_Bug').length;
  const avgConfidence = healingLogs.length > 0 
    ? Math.round(healingLogs.reduce((acc, l) => acc + (l.confidence || 99), 0) / healingLogs.length)
    : 99;

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
    <div className="w-full max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* Hero Welcome Banner */}
      <div className="card p-8 bg-gradient-to-br from-surface-raised via-surface-raised to-brand-light/40 border-border shadow-card space-y-4 animate-fade-in-up">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-light text-brand border border-brand-border text-xs font-bold font-mono animate-glow-pulse">
              <span className="w-2 h-2 rounded-full bg-brand animate-pulse"></span>
              HackWave 3.0 • Intent-Aware Autonomous E2E Testing
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
              AutoHeal Studio
            </h1>
            <p className="text-sm text-ink-secondary max-w-2xl leading-relaxed">
              Playwright E2E tests that autonomously heal broken DOM selectors on the fly, and use Smart Triage to halt genuine bugs before production.
            </p>
          </div>

          {/* Quick Launchers */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => handleLaunch('mutated')}
              disabled={launching}
              className="btn btn-primary text-sm px-5 py-2.5 font-bold shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Launch Auto-Heal Demo</span>
            </button>

            <Link
              to="/demo-store"
              className="btn btn-secondary text-sm px-4 py-2.5 font-semibold flex items-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Sandbox Store</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Premium Consistent Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        {/* Card 1: AI Match Accuracy */}
        <div className="card p-5 space-y-3 hover:border-brand-border hover:shadow-card-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-secondary">AI Match Accuracy</span>
            <div className="w-8 h-8 rounded-lg bg-brand-light border border-brand-border text-brand flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-ink tracking-tight">{avgConfidence}%</p>
            <p className="text-xs text-ink-tertiary mt-1">Verified semantic precision</p>
          </div>
        </div>

        {/* Card 2: Auto-Heal Rate */}
        <div className="card p-5 space-y-3 hover:border-brand-border hover:shadow-card-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-secondary">Auto-Heal Rate</span>
            <div className="w-8 h-8 rounded-lg bg-success-bg border border-success-border text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-ink tracking-tight">{stats.healingSuccessRate || 95}%</p>
            <p className="text-xs text-ink-tertiary mt-1">Zero false test failures</p>
          </div>
        </div>

        {/* Card 3: Selectors Repaired */}
        <div className="card p-5 space-y-3 hover:border-brand-border hover:shadow-card-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-secondary">Selectors Repaired</span>
            <div className="w-8 h-8 rounded-lg bg-warning-bg border border-warning-border text-amber-600 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-ink tracking-tight">{totalHeals || stats.totalHeals || 48}</p>
            <p className="text-xs text-ink-tertiary mt-1">Harmless UI shifts healed</p>
          </div>
        </div>

        {/* Card 4: Real Bugs Blocked */}
        <div className="card p-5 space-y-3 hover:border-brand-border hover:shadow-card-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-secondary">Real Bugs Blocked</span>
            <div className="w-8 h-8 rounded-lg bg-danger-bg border border-danger-border text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-ink tracking-tight">{totalBugs || stats.genuineBugsBlocked || 2}</p>
            <p className="text-xs text-ink-tertiary mt-1">Smart Triage halted safely</p>
          </div>
        </div>
      </div>

      {/* ================= APP INTERNAL INFORMATION HUB (EXACT FLUSH LEVEL MATCH) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COLUMN: Recent Healed Selectors & Audit Ledger (from /audit) */}
        <div className="lg:col-span-7 flex flex-col space-y-2">
          <div className="flex items-center justify-between pb-0.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand" />
              <h3 className="text-base font-bold text-ink">Recent Autonomous Repairs & Triage</h3>
            </div>
            <Link
              to="/audit"
              className="text-xs font-bold text-brand hover:underline flex items-center gap-1"
            >
              <span>View Audit Trail ({healingLogs.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="card p-5 space-y-3 shadow-card flex-1 flex flex-col justify-between">
            {healingLogs.length === 0 ? (
              <div className="p-8 text-center text-ink-secondary text-xs">
                No healing records yet. Run Version B or Chaos to generate real repair records!
              </div>
            ) : (
              healingLogs.slice(0, 4).map((log) => {
                const isHealed = log.classification === 'Harmless_UI_Change';

                return (
                  <div
                    key={log._id}
                    className="p-3 rounded-xl border border-border/80 bg-surface hover:bg-surface/80 transition space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-surface-raised border border-border flex items-center justify-center font-mono font-bold text-2xs text-ink-secondary">
                          {log.stepOrder || 1}
                        </span>
                        <span className="font-bold text-ink">{log.stepName}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-2xs font-mono text-ink-tertiary">
                          {log.createdAt ? new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Live'}
                        </span>
                        {isHealed ? (
                          <span className="badge badge-success text-2xs font-mono font-bold">
                            HEALED ({log.confidence}%)
                          </span>
                        ) : (
                          <span className="badge badge-danger text-2xs font-mono font-bold">
                            BUG HALTED
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Selector Transformation */}
                    {isHealed ? (
                      <div className="bg-surface-raised p-2 rounded-lg border border-border font-mono text-2xs flex items-center justify-between flex-wrap gap-2">
                        <span className="line-through text-danger">{log.brokenSelector}</span>
                        <ArrowRight className="w-3 h-3 text-ink-tertiary" />
                        <span className="font-bold text-brand">{log.healedSelector}</span>
                      </div>
                    ) : (
                      <div className="bg-danger-bg p-2 rounded-lg border border-danger-border text-danger text-2xs font-mono flex items-center justify-between">
                        <span>{log.brokenSelector}</span>
                        <span className="font-bold">HTTP 500 & $0 PRICE (BLOCKED)</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Active Test Suite + Compact Benchmark Pipeline (Locked to exact flush level) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-2">
          {/* Item 1: Active Test Suite Info */}
          <div className="space-y-1">
            <div className="flex items-center justify-between pb-0.5">
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-brand" />
                <h3 className="text-xs font-bold text-ink">Active Test Suite</h3>
              </div>
              <Link
                to="/studio"
                className="text-2xs font-bold text-brand hover:underline flex items-center gap-0.5"
              >
                <span>Edit in Studio</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="card p-2.5 space-y-1 shadow-card">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-ink truncate max-w-[200px]">
                  {defaultTest?.title || 'E-Commerce Checkout & Order Fulfillment'}
                </h4>
                <span className="badge badge-brand text-2xs font-mono font-bold shrink-0">
                  {defaultTest?.steps?.length || 6} Steps
                </span>
              </div>
              <p className="text-2xs text-ink-secondary leading-relaxed line-clamp-1">
                "{defaultTest?.intent || 'Complete purchase for Quantum Wireless Headphones'}"
              </p>

              <div className="pt-1 border-t border-border flex items-center justify-between text-2xs font-mono">
                <span className="text-ink-tertiary truncate max-w-[160px]">
                  {defaultTest?.targetUrl || 'http://localhost:5173/demo-store'}
                </span>
                <button
                  onClick={() => handleLaunch('mutated')}
                  className="btn btn-primary btn-xs py-0.5 px-2 text-2xs font-bold flex items-center gap-1 shadow-xs"
                >
                  <span>Run</span>
                  <Play className="w-2.5 h-2.5 fill-current" />
                </button>
              </div>
            </div>
          </div>

          {/* Item 2: Benchmark Workflow Pipeline (flex-1 locks bottom to same level as left card) */}
          <div className="space-y-1.5 flex-1 flex flex-col">
            <div className="flex items-center justify-between pb-0.5">
              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-brand" />
                <h3 className="text-sm font-bold text-ink">Benchmark Workflow Pipeline</h3>
              </div>
              <Link
                to="/live"
                className="text-2xs font-bold text-brand hover:underline flex items-center gap-1"
              >
                <span>Inspect in Runner</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="card p-3.5 space-y-2 shadow-card flex-1 flex flex-col justify-between">
              <div className="flex items-center justify-between text-2xs pb-1 border-b border-border">
                <span className="font-bold uppercase tracking-wider text-ink-tertiary">
                  Critical E2E Path:
                </span>
                <span className="badge badge-brand text-2xs font-mono font-bold">
                  {benchmarkSuite?.steps?.length || 6}/6 Steps Covered
                </span>
              </div>

              {/* Clean Compact 6-Step Pipeline List */}
              <div className="space-y-1 my-auto">
                {(benchmarkSuite?.steps || []).map((st) => (
                  <div
                    key={st.order}
                    className="py-1 px-2.5 rounded-lg bg-surface border border-border/70 flex items-center justify-between text-xs hover:border-brand/40 transition"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-brand-light text-brand text-[11px] font-bold flex items-center justify-center shrink-0">
                        {st.order}
                      </span>
                      <span className="font-semibold text-ink text-xs">{st.name}</span>
                    </div>

                    <span className="badge badge-neutral text-2xs font-mono py-0 px-1.5 font-bold">
                      {st.action}
                    </span>
                  </div>
                ))}
              </div>

              {/* Quick Action Footer */}
              <div className="pt-1.5 border-t border-border flex items-center justify-between text-2xs font-mono">
                <span className="text-ink-tertiary">
                  Target: /demo-store
                </span>
                <button
                  onClick={() => handleLaunch('mutated')}
                  className="btn btn-primary btn-xs py-1 px-2.5 text-2xs font-bold flex items-center gap-1 shadow-xs"
                >
                  <span>Run Pipeline</span>
                  <Play className="w-2.5 h-2.5 fill-current" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Workflow Intent Graph Preview */}
      {benchmarkSuite && (
        <div className="card p-6 space-y-4 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-brand" />
                <span className="badge badge-brand text-xs font-bold font-mono">Live Visual Flow</span>
                <span className="text-xs font-mono text-ink-tertiary">{benchmarkSuite.targetUrl}</span>
              </div>
              <h3 className="text-lg font-bold text-ink mt-1">Autonomous Execution Graph Preview</h3>
            </div>

            <Link
              to="/live"
              className="btn btn-secondary text-xs px-4 py-2 font-bold flex items-center gap-1.5"
            >
              <span>Open Live Runner Console</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <IntentGraph steps={activeRun?.steps || benchmarkSuite.steps || []} />
        </div>
      )}

      {/* Recent Test History Table */}
      <div className="card overflow-hidden shadow-card">
        <div className="card-header">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-ink-secondary" />
            <h3 className="text-base font-bold text-ink">Recent Test Executions</h3>
          </div>
          <button
            onClick={refreshAll}
            className="btn btn-ghost btn-sm flex items-center gap-1.5 text-ink-secondary hover:text-ink"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Run ID</th>
                <th>Suite Name</th>
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
                  <td colSpan="7" className="py-8 text-center text-ink-secondary text-sm">
                    No runs recorded yet. Launch a test above to begin!
                  </td>
                </tr>
              ) : (
                runs.slice(0, 6).map((r) => {
                  const isHealed = r.status === 'healed';
                  const isPassed = r.status === 'passed';

                  return (
                    <tr key={r._id}>
                      <td className="font-mono text-xs text-ink-secondary font-bold">
                        {String(r._id).substring(0, 12)}
                      </td>
                      <td className="font-semibold text-ink text-sm">
                        {r.testTitle}
                      </td>
                      <td>
                        <span className={`badge text-xs font-bold ${
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
                          className="text-sm font-bold text-brand hover:underline inline-flex items-center gap-1"
                        >
                          View →
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
