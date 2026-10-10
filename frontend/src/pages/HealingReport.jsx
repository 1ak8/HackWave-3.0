import React, { useState } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  Search, 
  Sparkles, 
  CheckCircle2,
  Filter
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

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-6 space-y-6">
      {/* Header */}
      <div className="card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand" />
            <span className="text-2xs font-mono text-brand uppercase font-bold tracking-wider">
              Compliance & Verification
            </span>
          </div>
          <h1 className="text-xl font-bold text-ink mt-1">Autonomous Repair Audit Log</h1>
          <p className="text-xs text-ink-secondary mt-0.5">
            Cryptographically logged record of all dynamic repairs, triage classifications, and blocked regressions.
          </p>
        </div>

        {/* Counter Pills */}
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-lg bg-success-bg border border-success-border text-center">
            <span className="text-2xs text-success-text block font-mono font-medium">Repaired</span>
            <span className="text-sm font-bold text-success font-mono">{stats.totalHeals || healingLogs.length}</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-lg bg-danger-bg border border-danger-border text-center">
            <span className="text-2xs text-danger-text block font-mono font-medium">Triaged</span>
            <span className="text-sm font-bold text-danger font-mono">{stats.genuineBugsBlocked || 0}</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="card p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-ink-tertiary absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by step, intent, or selector..."
            className="input pl-9 text-xs"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-surface rounded-lg border border-border">
          <button
            onClick={() => setFilter('ALL')}
            className={`btn btn-xs ${
              filter === 'ALL'
                ? 'bg-white text-ink shadow-xs border border-border'
                : 'btn-ghost'
            }`}
          >
            All ({healingLogs.length})
          </button>
          <button
            onClick={() => setFilter('Harmless_UI_Change')}
            className={`btn btn-xs flex items-center gap-1 ${
              filter === 'Harmless_UI_Change'
                ? 'bg-success text-white shadow-xs'
                : 'btn-ghost'
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            Auto-Healed
          </button>
          <button
            onClick={() => setFilter('Genuine_Bug')}
            className={`btn btn-xs flex items-center gap-1 ${
              filter === 'Genuine_Bug'
                ? 'bg-danger text-white shadow-xs'
                : 'btn-ghost'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            Bugs Triaged
          </button>
        </div>
      </div>

      {/* Audit Log Cards */}
      <div className="space-y-3">
        {filteredLogs.length === 0 ? (
          <div className="card p-12 text-center border-dashed">
            <FileText className="w-10 h-10 text-ink-tertiary mx-auto mb-2" />
            <h3 className="text-sm font-bold text-ink">No Healing Audit Records Found</h3>
            <p className="text-xs text-ink-secondary mt-1">
              Trigger a test run in "Version B (Auto-Heal)" or "Live Chaos" mode to populate this audit trail.
            </p>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const isHealed = log.classification === 'Harmless_UI_Change';

            return (
              <div
                key={log._id}
                className="card p-5 space-y-3.5 hover:border-border-strong transition"
              >
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-border">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded bg-surface border border-border text-xs font-mono font-bold flex items-center justify-center text-ink-secondary">
                      {log.stepOrder || 1}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-ink">{log.stepName}</h3>
                      <p className="text-xs text-ink-secondary">
                        Intent Goal: <span className="text-ink font-medium">"{log.userIntent}"</span>
                      </p>
                    </div>
                  </div>

                  <div>
                    {isHealed ? (
                      <span className="badge badge-success text-2xs font-mono font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        Harmless Mutation • Healed ({log.confidence}%)
                      </span>
                    ) : (
                      <span className="badge badge-danger text-2xs font-mono font-bold">
                        <AlertTriangle className="w-3 h-3" />
                        Genuine Regression • Healing Refused
                      </span>
                    )}
                  </div>
                </div>

                {/* Selectors Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="bg-danger-bg/40 p-2.5 rounded-lg border border-danger-border">
                    <span className="text-2xs text-danger-text uppercase tracking-wider block mb-1 font-bold">
                      Original Selector (Broken)
                    </span>
                    <code className="text-danger font-bold text-xs">{log.brokenSelector}</code>
                  </div>

                  <div className="bg-success-bg/40 p-2.5 rounded-lg border border-success-border">
                    <span className="text-2xs text-success-text uppercase tracking-wider block mb-1 font-bold">
                      Autonomously Repaired Selector
                    </span>
                    <code className="text-success font-bold text-xs">{log.healedSelector}</code>
                  </div>
                </div>

                {/* AI Reasoning */}
                <div className="bg-surface p-3 rounded-lg border border-border text-xs text-ink-secondary leading-relaxed">
                  <div className="flex items-center gap-1.5 mb-1 text-ink text-2xs font-mono uppercase font-bold">
                    <Sparkles className="w-3 h-3 text-brand" />
                    <span>Resolution Strategy</span>
                    <span className="text-ink-tertiary">• {log.strategyLayer}</span>
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
