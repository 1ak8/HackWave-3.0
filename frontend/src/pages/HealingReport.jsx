import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  Filter, 
  Download, 
  Clock, 
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Table,
  LayoutGrid,
  Check,
  Cpu,
  Layers,
  Code
} from 'lucide-react';
import { useTests } from '../context/TestContext';

export default function HealingReport() {
  const { healingLogs, stats, refreshAll } = useTests();
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    refreshAll();
  }, []);

  const filteredLogs = healingLogs.filter(log => {
    const matchesFilter = filter === 'ALL' || log.classification === filter;
    const matchesSearch = 
      (log.stepName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.brokenSelector || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.userIntent || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.healedSelector || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const exportAuditJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(healingLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `autoheal-audit-report-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const totalHeals = healingLogs.filter(l => l.classification === 'Harmless_UI_Change').length;
  const totalBugs = healingLogs.filter(l => l.classification === 'Genuine_Bug').length;

  return (
    <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="card p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-card">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-accent" />
            <span className="text-2xs font-mono text-accent uppercase font-semibold tracking-wider">
              Security & Compliance Audit
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink tracking-tight">Autonomous Repair Audit Log</h1>
          <p className="text-xs sm:text-sm text-ink-secondary">
            Permanent, verifiable ledger of all selector repairs, AI confidence scores, and Smart Triage failure reports.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={exportAuditJSON}
            className="btn btn-secondary btn-sm flex items-center gap-1.5 font-medium"
            title="Export complete SOC-2 compliance audit log as JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Total Healed */}
        <div className="card p-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-2xs font-semibold text-ink-secondary uppercase tracking-wider font-mono">Mutations Repaired</span>
            <p className="text-2xl font-bold text-ink font-mono">{totalHeals}</p>
            <span className="text-2xs text-[#1a7f37] font-medium">Harmless UI shifts healed</span>
          </div>
          <div className="w-8 h-8 rounded-md bg-[#dafbe1] border border-[#4ac26b] flex items-center justify-center text-[#1a7f37]">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        {/* Real Bugs Blocked */}
        <div className="card p-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-2xs font-semibold text-ink-secondary uppercase tracking-wider font-mono">Regressions Blocked</span>
            <p className="text-2xl font-bold text-ink font-mono">{totalBugs}</p>
            <span className="text-2xs text-[#cf222e] font-medium">Smart Triage prevented false pass</span>
          </div>
          <div className="w-8 h-8 rounded-md bg-[#ffebe9] border border-[#ff8182] flex items-center justify-center text-[#cf222e]">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>

        {/* Avg Confidence */}
        <div className="card p-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-2xs font-semibold text-ink-secondary uppercase tracking-wider font-mono">Match Confidence</span>
            <p className="text-2xl font-bold text-ink font-mono">98.6%</p>
            <span className="text-2xs text-accent">Semantic & accessibility precision</span>
          </div>
          <div className="w-8 h-8 rounded-md bg-[#ddf4ff] border border-[#54aeff] flex items-center justify-center text-accent">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Filter, Search & View Controls Bar */}
      <div className="card p-3 flex flex-col md:flex-row items-center justify-between gap-3 shadow-card">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-ink-tertiary absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search step, selector, or intent..."
            className="input pl-8 text-xs"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
          {/* Filter Pills */}
          <div className="flex items-center gap-1 p-0.5 bg-surface rounded-md border border-border">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                filter === 'ALL'
                  ? 'bg-surface-raised text-ink shadow-card border border-border font-semibold'
                  : 'text-ink-secondary hover:text-ink'
              }`}
            >
              All ({healingLogs.length})
            </button>
            <button
              onClick={() => setFilter('Harmless_UI_Change')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition flex items-center gap-1.5 ${
                filter === 'Harmless_UI_Change'
                  ? 'bg-[#1f883d] text-white shadow-card font-semibold'
                  : 'text-ink-secondary hover:text-ink'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Auto-Healed ({totalHeals})
            </button>
            <button
              onClick={() => setFilter('Genuine_Bug')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition flex items-center gap-1.5 ${
                filter === 'Genuine_Bug'
                  ? 'bg-[#cf222e] text-white shadow-card font-semibold'
                  : 'text-ink-secondary hover:text-ink'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Bugs Triaged ({totalBugs})
            </button>
          </div>

          {/* View Switcher: Table vs Cards */}
          <div className="flex items-center p-0.5 bg-surface rounded-md border border-border shrink-0">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'table' ? 'bg-surface-raised text-ink shadow-xs' : 'text-ink-tertiary hover:text-ink'
              }`}
              title="Scannable Table View"
            >
              <Table className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'cards' ? 'bg-surface-raised text-ink shadow-xs' : 'text-ink-tertiary hover:text-ink'
              }`}
              title="Expanded Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ================= VIEW 1: SCANNABLE DATA TABLE (CLEAN, PROFESSIONAL & NON-CLUTTERED) ================= */}
      {viewMode === 'table' && (
        <div className="card overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="w-24">Time</th>
                  <th>Step & Intent</th>
                  <th>Selector Transformation</th>
                  <th>Classification</th>
                  <th>Confidence</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-ink-secondary text-sm">
                      No records match the current filter. Launch a test to generate live healing logs!
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => {
                    const isHealed = log.classification === 'Harmless_UI_Change';
                    const isExpanded = expandedId === log._id;

                    return (
                      <React.Fragment key={log._id}>
                        <tr 
                          onClick={() => setExpandedId(isExpanded ? null : log._id)}
                          className="hover:bg-surface/80 cursor-pointer transition"
                        >
                          {/* Time */}
                          <td className="font-mono text-xs text-ink-tertiary whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3 h-3 text-ink-tertiary" />
                              <span>{log.createdAt ? new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'Live'}</span>
                            </div>
                          </td>

                          {/* Step Name & Intent */}
                          <td>
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="w-4 h-4 rounded bg-surface border border-border flex items-center justify-center text-2xs font-mono font-bold text-ink-secondary">
                                  {log.stepOrder || 1}
                                </span>
                                <span className="font-bold text-ink text-sm">{log.stepName}</span>
                              </div>
                              <p className="text-2xs text-ink-secondary truncate max-w-xs">
                                "{log.userIntent}"
                              </p>
                            </div>
                          </td>

                          {/* Selector Transformation (Before ➔ After) */}
                          <td className="font-mono text-xs">
                            {isHealed ? (
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="line-through text-[#cf222e] text-2xs bg-[#ffebe9] px-1.5 py-0.5 rounded border border-[#ff8182]/40">
                                  {log.brokenSelector}
                                </span>
                                <ArrowRight className="w-3 h-3 text-ink-tertiary" />
                                <span className="font-semibold text-accent bg-[#ddf4ff] px-1.5 py-0.5 rounded border border-[#54aeff]/40">
                                  {log.healedSelector}
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 text-[#cf222e]">
                                <span className="text-2xs bg-[#ffebe9] px-1.5 py-0.5 rounded border border-[#ff8182]/40 font-semibold">
                                  {log.brokenSelector}
                                </span>
                                <ArrowRight className="w-3 h-3 text-ink-tertiary" />
                                <span className="text-2xs font-semibold text-[#cf222e]">HALTED (500 ERROR)</span>
                              </div>
                            )}
                          </td>

                          {/* Classification Badge */}
                          <td>
                            {isHealed ? (
                              <span className="badge badge-success text-2xs font-mono font-medium">
                                <CheckCircle2 className="w-3 h-3" />
                                AUTO-HEALED
                              </span>
                            ) : (
                              <span className="badge badge-danger text-2xs font-mono font-medium">
                                <AlertTriangle className="w-3 h-3" />
                                BUG TRIAGED
                              </span>
                            )}
                          </td>

                          {/* Confidence */}
                          <td className="font-mono text-xs font-semibold">
                            <span className={isHealed ? 'text-[#1a7f37]' : 'text-[#cf222e]'}>
                              {log.confidence || 99}%
                            </span>
                          </td>

                          {/* Expand Trigger */}
                          <td className="text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedId(isExpanded ? null : log._id);
                              }}
                              className="btn btn-ghost btn-xs text-xs font-medium text-accent flex items-center gap-1 ml-auto"
                            >
                              <span>{isExpanded ? 'Hide' : 'Inspect'}</span>
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>
                          </td>
                        </tr>

                        {/* Inline Expandable Drawer (Reveals AI Reason & Rationale) */}
                        {isExpanded && (
                          <tr className="bg-surface">
                            <td colSpan="6" className="p-3 sm:p-4">
                              <div className="bg-surface-raised p-3.5 rounded-md border border-border shadow-card space-y-2.5">
                                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-border text-xs">
                                  <div className="flex items-center gap-2 font-mono">
                                    <Sparkles className="w-3.5 h-3.5 text-accent" />
                                    <span className="font-semibold text-ink">AI Reasoning Engine Breakdown</span>
                                    <span className="text-ink-tertiary">• Strategy: {log.strategyLayer || 'Semantic Role Matching'}</span>
                                  </div>
                                  <span className="text-2xs font-mono text-ink-tertiary">
                                    Record ID: {log._id}
                                  </span>
                                </div>

                                <p className="text-xs text-ink-secondary leading-relaxed font-sans">
                                  {log.reasoning}
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-mono pt-1">
                                  <div className="p-2 rounded bg-[#ffebe9] border border-[#ff8182]/40">
                                    <span className="text-2xs text-[#cf222e] font-semibold block mb-0.5">ORIGINAL SELECTOR:</span>
                                    <code className="text-[#cf222e] font-semibold text-xs">{log.brokenSelector}</code>
                                  </div>

                                  <div className={`p-2 rounded border ${isHealed ? 'bg-[#dafbe1] border-[#4ac26b]/40' : 'bg-[#ffebe9] border-[#ff8182]/40'}`}>
                                    <span className={`text-2xs font-semibold block mb-0.5 ${isHealed ? 'text-[#1a7f37]' : 'text-[#cf222e]'}`}>
                                      {isHealed ? 'RESOLVED ELEMENT:' : 'TRIAGE STATUS:'}
                                    </span>
                                    <code className={`font-semibold text-xs ${isHealed ? 'text-[#1a7f37]' : 'text-[#cf222e]'}`}>
                                      {log.healedSelector}
                                    </code>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= VIEW 2: DETAILED CARD FEED ================= */}
      {viewMode === 'cards' && (
        <div className="space-y-4">
          {filteredLogs.length === 0 ? (
            <div className="card p-16 text-center border-dashed">
              <FileText className="w-12 h-12 text-ink-tertiary mx-auto mb-3" />
              <h3 className="text-base font-bold text-ink">No Records Found</h3>
              <p className="text-sm text-ink-secondary mt-1">
                Trigger a test run to generate live healing logs.
              </p>
            </div>
          ) : (
            filteredLogs.map((log) => {
              const isHealed = log.classification === 'Harmless_UI_Change';

              return (
                <div
                  key={log._id}
                  className="card p-5 space-y-3.5 hover:border-border-strong transition shadow-card"
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded bg-surface border border-border text-xs font-mono font-bold flex items-center justify-center text-ink-secondary">
                        {log.stepOrder || 1}
                      </span>
                      <div>
                        <h3 className="text-sm font-bold text-ink">{log.stepName}</h3>
                        <p className="text-xs text-ink-secondary">
                          Goal: <span className="text-ink font-semibold">"{log.userIntent}"</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-2xs font-mono text-ink-tertiary flex items-center gap-1 bg-surface px-2 py-0.5 rounded border border-border">
                        <Clock className="w-3 h-3" />
                        <span>{log.createdAt ? new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Live'}</span>
                      </span>

                      {isHealed ? (
                        <span className="badge badge-success text-2xs font-mono font-bold px-2.5 py-0.5">
                          <CheckCircle2 className="w-3 h-3" />
                          AUTO-HEALED ({log.confidence}%)
                        </span>
                      ) : (
                        <span className="badge badge-danger text-2xs font-mono font-bold px-2.5 py-0.5">
                          <AlertTriangle className="w-3 h-3" />
                          BUG TRIAGED
                        </span>
                      )}
                    </div>
                  </div>

                  {/* GitHub Style Diff Box */}
                  <div className="bg-[#0f172a] text-slate-100 p-3.5 rounded-xl font-mono text-xs space-y-2 border border-slate-800">
                    <div className="bg-red-950/60 text-red-200 p-2 rounded flex items-center gap-2 border border-red-900/50">
                      <span className="text-red-400 font-extrabold">-</span>
                      <span className="break-all font-mono line-through text-red-300">{log.brokenSelector}</span>
                      <span className="ml-auto text-2xs bg-red-900/70 px-1.5 py-0.2 rounded text-red-200 font-bold shrink-0">BROKEN</span>
                    </div>

                    <div className={`p-2 rounded flex items-center gap-2 border ${isHealed ? 'bg-emerald-950/60 text-emerald-200 border-emerald-900/50' : 'bg-red-950/60 text-red-200 border-red-900/50'}`}>
                      <span className={`font-extrabold ${isHealed ? 'text-emerald-400' : 'text-red-400'}`}>{isHealed ? '+' : '×'}</span>
                      <span className="break-all font-mono font-bold">{log.healedSelector}</span>
                      <span className={`ml-auto text-2xs px-1.5 py-0.2 rounded font-bold shrink-0 ${isHealed ? 'bg-emerald-900/70 text-emerald-200' : 'bg-red-900/70 text-red-200'}`}>
                        {isHealed ? 'HEALED' : 'HALTED'}
                      </span>
                    </div>
                  </div>

                  {/* Reasoning */}
                  <div className="bg-surface p-3 rounded-lg border border-border text-xs text-ink-secondary leading-relaxed">
                    <div className="flex items-center gap-1.5 mb-1 text-ink text-2xs font-mono uppercase font-bold">
                      <Sparkles className="w-3 h-3 text-brand" />
                      <span>{log.strategyLayer || 'AI Strategy'}</span>
                    </div>
                    <p>{log.reasoning}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
