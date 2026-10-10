import React, { useState } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  Search, 
  Sparkles, 
  CheckCircle
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
    <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-apple-blue" />
            <span className="text-xs font-mono text-apple-blue uppercase font-bold tracking-wider">
              Compliance & Audit Trail
            </span>
          </div>
          <h1 className="text-2xl font-bold text-apple-text mt-1 tracking-tight">Autonomous Repair Audit Log</h1>
          <p className="text-xs text-apple-secondary">
            Permanent record of element repairs, multi-strategy classifications, and Smart Triage failure reports.
          </p>
        </div>

        {/* Stats Pill */}
        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-xl border border-black/[0.06] p-2.5 rounded-2xl shadow-apple-sm">
          <div className="px-3 py-1 text-center">
            <span className="text-[10px] text-apple-secondary block font-mono font-medium">Total Healed</span>
            <span className="text-base font-bold text-apple-green font-mono">{stats.totalHeals || healingLogs.length}</span>
          </div>
          <div className="w-px h-8 bg-black/[0.06]"></div>
          <div className="px-3 py-1 text-center">
            <span className="text-[10px] text-apple-secondary block font-mono font-medium">Bugs Triaged</span>
            <span className="text-base font-bold text-apple-red font-mono">{stats.genuineBugsBlocked || 0}</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white/80 backdrop-blur-xl border border-black/[0.06] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-apple-card">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-apple-tertiary absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by step, intent, or selector..."
            className="w-full bg-black/[0.03] border border-black/[0.06] rounded-xl pl-9 pr-4 py-2 text-xs text-apple-text focus:outline-none focus:border-apple-blue shadow-inner"
          />
        </div>

        {/* Apple Segmented Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-black/[0.04]">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3.5 py-1 rounded-full text-xs font-semibold transition ${
              filter === 'ALL'
                ? 'bg-white text-apple-text shadow-sm'
                : 'text-apple-secondary hover:text-apple-text'
            }`}
          >
            All ({healingLogs.length})
          </button>
          <button
            onClick={() => setFilter('Harmless_UI_Change')}
            className={`px-3.5 py-1 rounded-full text-xs font-semibold transition flex items-center gap-1.5 ${
              filter === 'Harmless_UI_Change'
                ? 'bg-apple-green-light text-apple-green border border-apple-green/20 shadow-sm'
                : 'text-apple-secondary hover:text-apple-text'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Harmless Auto-Heals
          </button>
          <button
            onClick={() => setFilter('Genuine_Bug')}
            className={`px-3.5 py-1 rounded-full text-xs font-semibold transition flex items-center gap-1.5 ${
              filter === 'Genuine_Bug'
                ? 'bg-apple-red-light text-apple-red border border-apple-red/20 shadow-sm'
                : 'text-apple-secondary hover:text-apple-text'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Genuine Bugs Triaged
          </button>
        </div>
      </div>

      {/* Audit Log Cards */}
      <div className="space-y-4">
        {filteredLogs.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-2xl border border-black/[0.06] rounded-3xl p-12 text-center shadow-apple-card">
            <FileText className="w-12 h-12 text-apple-tertiary/40 mx-auto mb-3" />
            <h3 className="text-base font-bold text-apple-text">No Healing Records Found</h3>
            <p className="text-xs text-apple-secondary mt-1">
              Trigger a test run in "Version B (Auto-Heal)" or "Live Chaos" mode to generate dynamic repair events.
            </p>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const isHealed = log.classification === 'Harmless_UI_Change';

            return (
              <div
                key={log._id}
                className="bg-white/80 backdrop-blur-2xl border border-black/[0.06] rounded-3xl p-5 hover:border-black/[0.12] transition shadow-apple-card space-y-4"
              >
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-black/[0.04]">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-black/[0.04] text-xs font-mono font-bold flex items-center justify-center text-apple-secondary">
                      {log.stepOrder || 1}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-apple-text">{log.stepName}</h3>
                      <p className="text-xs text-apple-secondary">
                        Intent: <span className="text-apple-text font-medium">"{log.userIntent}"</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isHealed ? (
                      <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-apple-green-light text-apple-green border border-apple-green/20 flex items-center gap-1 font-bold">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Harmless Mutation • Healed ({log.confidence}%)
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-apple-red-light text-apple-red border border-apple-red/20 flex items-center gap-1 font-bold">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Genuine Bug • Healing Blocked
                      </span>
                    )}
                  </div>
                </div>

                {/* Selectors Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="bg-apple-red-light/60 p-3 rounded-2xl border border-apple-red/20">
                    <span className="text-[10px] text-apple-red uppercase tracking-wider block mb-1 font-bold">
                      Original Selector (Failed)
                    </span>
                    <code className="text-apple-red font-bold">{log.brokenSelector}</code>
                  </div>

                  <div className="bg-apple-green-light/60 p-3 rounded-2xl border border-apple-green/20">
                    <span className="text-[10px] text-apple-green uppercase tracking-wider block mb-1 font-bold">
                      Healed Replacement Element
                    </span>
                    <code className="text-apple-green font-bold">{log.healedSelector}</code>
                  </div>
                </div>

                {/* AI Reasoning Text */}
                <div className="bg-black/[0.02] p-3.5 rounded-2xl border border-black/[0.04] text-xs text-apple-secondary leading-relaxed">
                  <div className="flex items-center gap-1.5 mb-1 text-apple-tertiary text-[10px] font-mono uppercase font-semibold">
                    <Sparkles className="w-3 h-3 text-apple-blue" />
                    <span>AI Reasoning & Resolution Strategy</span>
                    <span>• {log.strategyLayer}</span>
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
