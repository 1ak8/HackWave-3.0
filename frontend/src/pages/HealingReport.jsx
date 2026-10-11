import React, { useState } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  Search, 
  Sparkles, 
  CheckCircle2,
  Filter,
  Download,
  Clock
} from 'lucide-react';
import { useTests } from '../context/TestContext';

export default function HealingReport() {
  const { healingLogs, stats } = useTests();
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = healingLogs.filter(log => {
    const matchesFilter = filter === 'ALL' || log.classification === filter;
    const matchesSearch = 
      (log.stepName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.brokenSelector || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.userIntent || '').toLowerCase().includes(searchTerm.toLowerCase());
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

  return (
    <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="card p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-card">
        <div>
          <div className="flex items-center gap-2.5">
            <FileText className="w-4 h-4 text-brand" />
            <span className="text-xs font-mono text-brand uppercase font-bold tracking-wider">
              Compliance & Audit Trail
            </span>
          </div>
          <h1 className="text-2xl font-bold text-ink mt-1.5 tracking-tight">Autonomous Repair Audit Log</h1>
          <p className="text-sm text-ink-secondary mt-1">
            Permanent, immutable ledger of all selector repairs, AI confidence scores, and Smart Triage failure reports.
          </p>
        </div>

        {/* Counter Pills & Export */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-success-bg border border-success-border text-center shadow-xs">
            <span className="text-xs text-success-text block font-mono font-bold">Repaired</span>
            <span className="text-base font-extrabold text-success font-mono">{stats.totalHeals || healingLogs.length}</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-danger-bg border border-danger-border text-center shadow-xs">
            <span className="text-xs text-danger-text block font-mono font-bold">Triaged</span>
            <span className="text-base font-extrabold text-danger font-mono">{stats.genuineBugsBlocked || 0}</span>
          </div>
          <button
            onClick={exportAuditJSON}
            className="btn btn-secondary btn-sm flex items-center gap-1.5"
            title="Export complete SOC-2 compliance audit log as JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="card p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-card">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-ink-tertiary absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by step, intent, or selector..."
            className="input pl-10"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 p-1 bg-surface rounded-xl border border-border">
          <button
            onClick={() => setFilter('ALL')}
            className={`btn btn-xs ${
              filter === 'ALL'
                ? 'bg-white text-ink shadow-xs border border-border font-bold'
                : 'btn-ghost'
            }`}
          >
            All ({healingLogs.length})
          </button>
          <button
            onClick={() => setFilter('Harmless_UI_Change')}
            className={`btn btn-xs flex items-center gap-1.5 ${
              filter === 'Harmless_UI_Change'
                ? 'bg-success text-white shadow-xs font-bold'
                : 'btn-ghost'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Auto-Healed
          </button>
          <button
            onClick={() => setFilter('Genuine_Bug')}
            className={`btn btn-xs flex items-center gap-1.5 ${
              filter === 'Genuine_Bug'
                ? 'bg-danger text-white shadow-xs font-bold'
                : 'btn-ghost'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Bugs Triaged
          </button>
        </div>
      </div>

      {/* Audit Log Cards */}
      <div className="space-y-4">
        {filteredLogs.length === 0 ? (
          <div className="card p-16 text-center border-dashed">
            <FileText className="w-12 h-12 text-ink-tertiary mx-auto mb-3" />
            <h3 className="text-base font-bold text-ink">No Healing Audit Records Found</h3>
            <p className="text-sm text-ink-secondary mt-1 max-w-sm mx-auto">
              Trigger a test run in "Version B (Auto-Heal)" or "Live Chaos" mode to populate this audit trail.
            </p>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const isHealed = log.classification === 'Harmless_UI_Change';

            return (
              <div
                key={log._id}
                className="card p-6 space-y-4 hover:border-border-strong transition shadow-card"
              >
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
                  <div className="flex items-center gap-3.5">
                    <span className="w-7 h-7 rounded-md bg-surface border border-border text-xs font-mono font-bold flex items-center justify-center text-ink-secondary">
                      {log.stepOrder || 1}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-ink">{log.stepName}</h3>
                      <p className="text-xs text-ink-secondary mt-0.5">
                        Intent Goal: <span className="text-ink font-semibold">"{log.userIntent}"</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-2xs font-mono text-ink-tertiary flex items-center gap-1 bg-surface px-2 py-0.5 rounded border border-border">
                      <Clock className="w-3 h-3 text-ink-tertiary" />
                      <span>{log.createdAt ? new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'Live Event'}</span>
                    </span>
                    {log.runId && (
                      <span className="text-2xs font-mono text-ink-tertiary bg-surface px-2 py-0.5 rounded border border-border hidden sm:inline">
                        Run: {String(log.runId).substring(0, 12)}
                      </span>
                    )}
                    {isHealed ? (
                      <span className="badge badge-success text-xs font-mono font-bold px-3 py-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Harmless Mutation • Healed ({log.confidence}%)
                      </span>
                    ) : (
                      <span className="badge badge-danger text-xs font-mono font-bold px-3 py-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Genuine Regression • Healing Refused
                      </span>
                    )}
                  </div>
                </div>

                {/* Selectors Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="bg-danger-bg/40 p-3.5 rounded-xl border border-danger-border">
                    <span className="text-xs text-danger-text uppercase tracking-wider block mb-1 font-bold">
                      Original Selector (Broken)
                    </span>
                    <code className="text-danger font-bold text-sm">{log.brokenSelector}</code>
                  </div>

                  <div className="bg-success-bg/40 p-3.5 rounded-xl border border-success-border">
                    <span className="text-xs text-success-text uppercase tracking-wider block mb-1 font-bold">
                      Autonomously Repaired Selector
                    </span>
                    <code className="text-success font-bold text-sm">{log.healedSelector}</code>
                  </div>
                </div>

                {/* AI Reasoning */}
                <div className="bg-surface p-4 rounded-xl border border-border text-sm text-ink-secondary leading-relaxed">
                  <div className="flex items-center gap-2 mb-1.5 text-ink text-xs font-mono uppercase font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-brand" />
                    <span>Resolution Strategy</span>
                    <span className="text-ink-tertiary font-medium">• {log.strategyLayer}</span>
                  </div>
                  <p>{log.reasoning}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
