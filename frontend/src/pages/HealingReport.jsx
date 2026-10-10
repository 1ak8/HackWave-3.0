import React, { useState } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  Search, 
  Filter, 
  Sparkles, 
  ArrowRight,
  Download,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useTests } from '../context/TestContext';

export default function HealingReport() {
  const { healingLogs, stats } = useTests();
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'Harmless_UI_Change' | 'Genuine_Bug'
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono text-emerald-400 uppercase font-semibold">
              Compliance & Healing Audit Trail
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">Autonomous Repair Audit Log</h1>
          <p className="text-xs text-slate-400">
            Immutable log of all element repairs, multi-strategy classifications, and Smart Triage failure reports.
          </p>
        </div>

        {/* Stats Pill */}
        <div className="flex items-center gap-3 bg-obsidian-900 border border-white/10 p-2 rounded-2xl">
          <div className="px-3 py-1 text-center">
            <span className="text-[10px] text-slate-400 block font-mono">Total Healed</span>
            <span className="text-base font-bold text-emerald-400 font-mono">{stats.totalHeals || healingLogs.length}</span>
          </div>
          <div className="w-px h-8 bg-white/10"></div>
          <div className="px-3 py-1 text-center">
            <span className="text-[10px] text-slate-400 block font-mono">Bugs Triaged</span>
            <span className="text-base font-bold text-red-400 font-mono">{stats.genuineBugsBlocked || 0}</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-obsidian-900 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by step, intent, or selector..."
            className="w-full bg-obsidian-950 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
              filter === 'ALL'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Events ({healingLogs.length})
          </button>
          <button
            onClick={() => setFilter('Harmless_UI_Change')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition flex items-center gap-1.5 ${
              filter === 'Harmless_UI_Change'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Harmless Auto-Heals
          </button>
          <button
            onClick={() => setFilter('Genuine_Bug')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition flex items-center gap-1.5 ${
              filter === 'Genuine_Bug'
                ? 'bg-red-500/20 text-red-300 border border-red-500/40 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            Genuine Bugs Triaged
          </button>
        </div>
      </div>

      {/* Audit Log Cards */}
      <div className="space-y-4">
        {filteredLogs.length === 0 ? (
          <div className="bg-obsidian-900 border border-white/10 rounded-2xl p-12 text-center">
            <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No Healing Records Found</h3>
            <p className="text-xs text-slate-400 mt-1">
              Trigger a test run in "Version B (Auto-Heal)" or "Live Chaos" mode to generate dynamic repair events.
            </p>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const isHealed = log.classification === 'Harmless_UI_Change';

            return (
              <div
                key={log._id}
                className="bg-obsidian-900 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition shadow-lg space-y-4"
              >
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-obsidian-800 text-xs font-mono font-bold flex items-center justify-center text-slate-300">
                      {log.stepOrder || 1}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white">{log.stepName}</h3>
                      <p className="text-[11px] text-slate-400">
                        Intent: <span className="text-slate-200">"{log.userIntent}"</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isHealed ? (
                      <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-semibold">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        Harmless UI Mutation • Healed ({log.confidence}%)
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-red-500/10 text-red-300 border border-red-500/30 flex items-center gap-1 font-semibold">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                        Genuine Bug • Healing Blocked
                      </span>
                    )}
                  </div>
                </div>

                {/* Selectors Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="bg-obsidian-950 p-3 rounded-xl border border-red-500/20">
                    <span className="text-[10px] text-red-400 uppercase tracking-wider block mb-1">
                      Original Selector (Failed)
                    </span>
                    <code className="text-red-300 font-bold">{log.brokenSelector}</code>
                  </div>

                  <div className="bg-obsidian-950 p-3 rounded-xl border border-emerald-500/20">
                    <span className="text-[10px] text-emerald-400 uppercase tracking-wider block mb-1">
                      Healed Replacement Element
                    </span>
                    <code className="text-emerald-300 font-bold">{log.healedSelector}</code>
                  </div>
                </div>

                {/* AI Reasoning Text */}
                <div className="bg-obsidian-850 p-3.5 rounded-xl border border-white/5 text-xs text-slate-300 leading-relaxed">
                  <div className="flex items-center gap-1.5 mb-1 text-slate-400 text-[10px] font-mono uppercase">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>AI Reasoning & Resolution Strategy</span>
                    <span className="text-slate-500">• {log.strategyLayer}</span>
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
