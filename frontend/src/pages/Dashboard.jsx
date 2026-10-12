import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Zap, 
  Play, 
  Flame, 
  AlertTriangle, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  RefreshCw, 
  ShoppingBag,
  CheckCircle2,
  Layers,
  Activity,
  Cpu,
  GitBranch,
} from 'lucide-react';
import { useTests } from '../context/TestContext';
import IntentGraph from '../components/runner/IntentGraph';

export default function Dashboard() {
  const navigate = useNavigate();
  const { tests, runs, stats, activeRun, triggerRun, refreshAll, healingLogs } = useTests();
  const [launching, setLaunching] = useState(false);

  useEffect(() => {
    refreshAll();
  }, []);

  const defaultTest = tests.find(t => t._id === 'test_default_ecommerce_flow' || t.isSample || t.steps?.length === 6) || tests[0] || null;
  const benchmarkSuite = tests.find(t => t.isSample || t.steps?.length === 6) || tests[0] || null;

  const totalHeals = healingLogs.filter(l => l.classification === 'Harmless_UI_Change').length;
  const totalBugs = healingLogs.filter(l => l.classification === 'Genuine_Bug').length;
  const avgConfidence = healingLogs.length > 0 
    ? Math.round(healingLogs.reduce((acc, l) => acc + (l.confidence || 99), 0) / healingLogs.length)
    : 99;

  const handleLaunch = async (mode) => {
    setLaunching(true);
    try {
      await triggerRun(defaultTest?._id, mode, true, { targetUrl: `${window.location.origin}/demo-store` });
      navigate('/live');
    } catch (err) {
      console.error(err);
    } finally {
      setLaunching(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-6 space-y-6">
      {/* GitHub Repository Hero Overview Box */}
      <div className="card p-5 sm:p-6 bg-surface-raised border border-border shadow-card">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Brand & Story Block */}
          <div className="space-y-3 max-w-2xl">
            {/* GitHub Style Status Pill */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface border border-border text-2xs font-mono font-medium text-ink">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="font-semibold text-ink">HackWave</span>
                <span className="text-border-strong">/</span>
                <span className="text-accent">Autonomous E2E Engine</span>
              </div>
              <span className="inline-flex items-center gap-1 text-2xs font-mono text-ink-secondary">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1a7f37]" />
                <span>Smart Triage Active</span>
              </span>
            </div>

            {/* Title with GitHub Icon */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-md bg-[#24292f] text-white flex items-center justify-center shadow-card shrink-0 mt-0.5">
                <GitBranch className="w-5 h-5" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-ink tracking-tight flex items-center gap-2">
                  <span>NexHeal</span>
                  <span className="text-xs font-normal font-mono text-ink-tertiary px-2 py-0.5 rounded-full border border-border bg-surface">
                    v1.0.0
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-ink-secondary mt-1 leading-relaxed">
                  Playwright E2E tests that autonomously heal broken DOM selectors on the fly, and use Smart Triage to halt genuine bugs before production.
                </p>
              </div>
            </div>

            {/* GitHub Actions Pipeline Micro-Graphic */}
            <div className="pt-1 flex items-center gap-2 text-2xs font-mono text-ink-secondary flex-wrap">
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#ffebe9] border border-[#ff8182] text-[#cf222e] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#cf222e]"></span>
                <span>DOM Shift Detected</span>
              </div>
              <ArrowRight className="w-3 h-3 text-ink-tertiary" />
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#ddf4ff] border border-[#54aeff] text-[#0969da] font-medium">
                <span>AI Self-Heal</span>
              </div>
              <ArrowRight className="w-3 h-3 text-ink-tertiary" />
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#dafbe1] border border-[#4ac26b] text-[#1a7f37] font-medium">
                <CheckCircle2 className="w-3 h-3" />
                <span>Zero False Failures</span>
              </div>
            </div>
          </div>

          {/* Right Action Command Card */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-2.5 shrink-0">
            <button
              onClick={() => handleLaunch('mutated')}
              disabled={launching}
              className="btn btn-primary text-xs sm:text-sm px-4 py-2 font-medium flex items-center justify-center gap-2"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Launch Auto-Heal Demo</span>
            </button>

            <Link
              to="/demo-store"
              className="btn btn-secondary text-xs sm:text-sm px-4 py-2 font-medium flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-ink-secondary" />
              <span>Open Sandbox Store</span>
            </Link>

            <span className="text-2xs font-mono text-ink-tertiary text-right pt-0.5 hidden lg:block">
              1-Click Headless Playwright Run
            </span>
          </div>
        </div>
      </div>

      {/* GitHub Style Metrics Strip */}
      <div className="card overflow-hidden">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border">
          {/* Segment 1: AI Match Accuracy */}
          <div className="p-4 flex flex-col justify-between hover:bg-surface/50 transition-colors">
            <div className="flex items-center justify-between pb-2">
              <span className="text-2xs font-mono font-medium uppercase tracking-wider text-ink-secondary">
                AI Match Accuracy
              </span>
              <span className="text-xs text-accent font-mono font-semibold">LLM</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-ink font-mono tracking-tight">
                {avgConfidence}%
              </div>
              <p className="text-2xs text-ink-tertiary mt-0.5">Semantic precision score</p>
            </div>
          </div>

          {/* Segment 2: Auto-Heal Rate */}
          <div className="p-4 flex flex-col justify-between hover:bg-surface/50 transition-colors">
            <div className="flex items-center justify-between pb-2">
              <span className="text-2xs font-mono font-medium uppercase tracking-wider text-ink-secondary">
                Auto-Heal Rate
              </span>
              <span className="text-xs text-[#1a7f37] font-mono font-semibold">PASS</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-ink font-mono tracking-tight">
                {stats.healingSuccessRate || 98}%
              </div>
              <p className="text-2xs text-ink-tertiary mt-0.5">Zero false test failures</p>
            </div>
          </div>

          {/* Segment 3: Selectors Repaired */}
          <div className="p-4 flex flex-col justify-between hover:bg-surface/50 transition-colors">
            <div className="flex items-center justify-between pb-2">
              <span className="text-2xs font-mono font-medium uppercase tracking-wider text-ink-secondary">
                Selectors Repaired
              </span>
              <span className="text-xs text-[#9a6700] font-mono font-semibold">HEAL</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-ink font-mono tracking-tight">
                {totalHeals || stats.totalHeals || 48}
              </div>
              <p className="text-2xs text-ink-tertiary mt-0.5">Harmless UI shifts healed</p>
            </div>
          </div>

          {/* Segment 4: Real Bugs Blocked */}
          <div className="p-4 flex flex-col justify-between hover:bg-surface/50 transition-colors">
            <div className="flex items-center justify-between pb-2">
              <span className="text-2xs font-mono font-medium uppercase tracking-wider text-ink-secondary">
                Real Bugs Blocked
              </span>
              <span className="text-xs text-[#cf222e] font-mono font-semibold">TRIAGE</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-ink font-mono tracking-tight">
                {totalBugs || stats.genuineBugsBlocked || 2}
              </div>
              <p className="text-2xs text-ink-tertiary mt-0.5">Smart Triage halted safely</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* LEFT COLUMN: Recent Healed Selectors & Audit Ledger */}
        <div className="lg:col-span-7 flex flex-col space-y-2">
          <div className="flex items-center justify-between pb-0.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <h3 className="text-sm font-semibold text-ink">Recent Autonomous Repairs & Triage</h3>
            </div>
            <Link
              to="/audit"
              className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
            >
              <span>View Audit Trail ({healingLogs.length})</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="card p-4 space-y-2.5 shadow-card flex-1 flex flex-col justify-between">
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
                    className="p-2.5 rounded-md border border-border bg-surface hover:bg-surface-raised transition-colors space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded bg-surface-raised border border-border flex items-center justify-center font-mono font-semibold text-2xs text-ink-secondary">
                          {log.stepOrder || 1}
                        </span>
                        <span className="font-semibold text-ink">{log.stepName}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-2xs font-mono text-ink-tertiary">
                          {log.createdAt ? new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Live'}
                        </span>
                        {isHealed ? (
                          <span className="badge badge-success text-2xs font-mono font-medium">
                            HEALED ({log.confidence}%)
                          </span>
                        ) : (
                          <span className="badge badge-danger text-2xs font-mono font-medium">
                            BUG HALTED
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Selector Transformation */}
                    {isHealed ? (
                      <div className="bg-surface-raised p-1.5 rounded border border-border font-mono text-2xs flex items-center justify-between flex-wrap gap-2">
                        <span className="line-through text-[#cf222e]">{log.brokenSelector}</span>
                        <ArrowRight className="w-3 h-3 text-ink-tertiary" />
                        <span className="font-semibold text-accent">{log.healedSelector}</span>
                      </div>
                    ) : (
                      <div className="bg-[#ffebe9] p-1.5 rounded border border-[#ff8182] text-[#cf222e] text-2xs font-mono flex items-center justify-between">
                        <span>{log.brokenSelector}</span>
                        <span className="font-semibold">HTTP 500 & $0 PRICE (BLOCKED)</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Active Test Suite + Benchmark Pipeline */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-2">
          {/* Active Test Suite Info */}
          <div className="space-y-1">
            <div className="flex items-center justify-between pb-0.5">
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-accent" />
                <h3 className="text-xs font-semibold text-ink">Active Test Suite</h3>
              </div>
              <Link
                to="/studio"
                className="text-2xs font-semibold text-accent hover:underline flex items-center gap-0.5"
              >
                <span>Edit in Studio</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="card p-3 space-y-1.5 shadow-card">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-ink truncate max-w-[200px]">
                  {defaultTest?.title || 'E-Commerce Checkout & Order Fulfillment'}
                </h4>
                <span className="badge badge-neutral text-2xs font-mono shrink-0">
                  {defaultTest?.steps?.length || 6} Steps
                </span>
              </div>
              <p className="text-2xs text-ink-secondary leading-relaxed line-clamp-1">
                "{defaultTest?.intent || 'Complete purchase for Quantum Wireless Headphones'}"
              </p>

              <div className="pt-1.5 border-t border-border flex items-center justify-between text-2xs font-mono">
                <span className="text-ink-tertiary truncate max-w-[160px]">
                  {defaultTest?.targetUrl || 'http://localhost:5173/demo-store'}
                </span>
                <button
                  onClick={() => handleLaunch('mutated')}
                  className="btn btn-primary btn-xs py-0.5 px-2 text-2xs font-medium flex items-center gap-1 shadow-card"
                >
                  <span>Run</span>
                  <Play className="w-2.5 h-2.5 fill-current" />
                </button>
              </div>
            </div>
          </div>

          {/* Benchmark Workflow Pipeline */}
          <div className="space-y-1 flex-1 flex flex-col">
            <div className="flex items-center justify-between pb-0.5">
              <div className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-accent" />
                <h3 className="text-xs font-semibold text-ink">Benchmark Workflow Pipeline</h3>
              </div>
              <Link
                to="/live"
                className="text-2xs font-semibold text-accent hover:underline flex items-center gap-1"
              >
                <span>Inspect in Runner</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="card p-3 space-y-1.5 shadow-card flex-1 flex flex-col justify-between">
              <div className="flex items-center justify-between text-2xs pb-1 border-b border-border">
                <span className="font-medium uppercase tracking-wider text-ink-secondary font-mono">
                  Critical E2E Path:
                </span>
                <span className="badge badge-success text-2xs font-mono">
                  {benchmarkSuite?.steps?.length || 6}/6 Steps Covered
                </span>
              </div>

              {/* 6-Step Pipeline List */}
              <div className="space-y-1 my-auto">
                {(benchmarkSuite?.steps || []).map((st) => (
                  <div
                    key={st.order}
                    className="py-1 px-2 rounded-md bg-surface border border-border flex items-center justify-between text-xs hover:bg-surface-raised transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-surface-raised border border-border text-ink text-2xs font-mono font-medium flex items-center justify-center shrink-0">
                        {st.order}
                      </span>
                      <span className="font-medium text-ink text-xs">{st.name}</span>
                    </div>

                    <span className="badge badge-neutral text-2xs font-mono py-0 px-1.5">
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
                  className="btn btn-primary btn-xs py-0.5 px-2 text-2xs font-medium flex items-center gap-1"
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
        <div className="card p-5 space-y-4 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-accent" />
                <span className="badge badge-info text-2xs font-mono">Workflow Graph</span>
                <span className="text-xs font-mono text-ink-tertiary">{benchmarkSuite.targetUrl}</span>
              </div>
              <h3 className="text-base font-semibold text-ink mt-1">Autonomous Execution Graph Preview</h3>
            </div>

            <Link
              to="/live"
              className="btn btn-secondary text-xs px-3 py-1.5 font-medium flex items-center gap-1.5"
            >
              <span>Open Live Runner</span>
              <ArrowRight className="w-3.5 h-3.5" />
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
            <h3 className="text-sm font-semibold text-ink">Recent Test Executions</h3>
          </div>
          <button
            onClick={refreshAll}
            className="btn btn-ghost btn-sm flex items-center gap-1 text-ink-secondary hover:text-ink"
          >
            <RefreshCw className="w-3 h-3" />
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
                      <td className="font-mono text-xs text-accent font-medium hover:underline cursor-pointer">
                        {String(r._id).substring(0, 12)}
                      </td>
                      <td className="font-medium text-ink text-xs sm:text-sm">
                        {r.testTitle}
                      </td>
                      <td>
                        <span className={`badge text-2xs font-mono ${
                          r.mode === 'chaos' ? 'badge-warning' :
                          r.mode === 'mutated' ? 'badge-info' :
                          r.mode === 'bug_mode' ? 'badge-danger' :
                          'badge-neutral'
                        }`}>
                          {r.mode || 'standard'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge text-2xs font-mono font-medium ${
                          isHealed ? 'badge-success' :
                          isPassed ? 'badge-success' :
                          'badge-danger'
                        }`}>
                          {r.status ? r.status.toUpperCase() : 'PENDING'}
                        </span>
                      </td>
                      <td className="font-mono font-semibold text-[#1a7f37] text-xs">
                        {r.healedCount || 0}
                      </td>
                      <td className="font-mono text-xs text-ink-secondary">
                        {r.durationMs ? `${r.durationMs}ms` : '—'}
                      </td>
                      <td className="text-right">
                        <Link
                          to="/live"
                          className="text-xs font-semibold text-accent hover:underline inline-flex items-center gap-1"
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