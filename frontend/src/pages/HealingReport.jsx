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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-600" />
            <span className="text-xs font-mono text-brand-700 uppercase font-bold">
              Compliance & Healing Audit Trail
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Autonomous Repair Audit Log</h1>
          <p className="text-xs text-slate-500">
            Immutable log of all element repairs, multi-strategy classifications, and Smart Triage failure reports.
          </p>
        </div>

        {/* Stats Pill */}
        <div className="flex items-center gap-3 bg-white border border-slate-200 p-2.5 rounded-2xl shadow-sm">
          <div className="px-3 py-1 text-center">
            <span className="text-[10px] text-slate-500 block font-mono font-medium">Total Healed</span>
            <span className="text-base font-extrabold text-emerald-700 font-mono">{stats.totalHeals || healingLogs.length}</span>
          </div>
          <div className="w-px h-8 bg-slate-200"></div>
          <div className="px-3 py-1 text-center">
            <span className="text-[10px] text-slate-500 block font-mono font-medium">Bugs Triaged</span>
            <span className="text-base font-extrabold text-red-600 font-mono">{stats.genuineBugsBlocked || 0}</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by step, intent, or selector..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-brand-600"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
              filter === 'ALL'
                ? 'bg-slate-900 text-white font-bold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Events ({healingLogs.length})
          </button>
          <button
            onClick={() => setFilter('Harmless_UI_Change')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition flex items-center gap-1.5 ${
              filter === 'Harmless_UI_Change'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Harmless Auto-Heals
          </button>
          <button
            onClick={() => setFilter('Genuine_Bug')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition flex items-center gap-1.5 ${
              filter === 'Genuine_Bug'
                ? 'bg-red-50 text-red-800 border border-red-300 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
            Genuine Bugs Triaged
          </button>
        </div>
      </div>

      {/* Audit Log Cards */}
      <div className="space-y-4">
        {filteredLogs.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
            <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No Healing Records Found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Trigger a test run in "Version B (Auto-Heal)" or "Live Chaos" mode to generate dynamic repair events.
            </p>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const isHealed = log.classification === 'Harmless_UI_Change';

            return (
              <div
                key={log._id}
                className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition shadow-sm space-y-4"
              >
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 text-xs font-mono font-bold flex items-center justify-center text-slate-700">
                      {log.stepOrder || 1}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{log.stepName}</h3>
                      <p className="text-xs text-slate-500">
                        Intent: <span className="text-slate-800 font-medium">"{log.userIntent}"</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isHealed ? (
                      <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1 font-bold">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        Harmless UI Mutation • Healed ({log.confidence}%)
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-red-50 text-red-800 border border-red-300 flex items-center gap-1 font-bold">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                        Genuine Bug • Healing Blocked
                      </span>
                    )}
                  </div>
                </div>

                {/* Selectors Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="bg-red-50/60 p-3 rounded-xl border border-red-200">
                    <span className="text-[10px] text-red-700 uppercase tracking-wider block mb-1 font-bold">
                      Original Selector (Failed)
                    </span>
                    <code className="text-red-800 font-bold">{log.brokenSelector}</code>
                  </div>

                  <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200">
                    <span className="text-[10px] text-emerald-800 uppercase tracking-wider block mb-1 font-bold">
                      Healed Replacement Element
                    </span>
                    <code className="text-emerald-800 font-bold">{log.healedSelector}</code>
                  </div>
                </div>

                {/* AI Reasoning Text */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  <div className="flex items-center gap-1.5 mb-1 text-slate-500 text-[10px] font-mono uppercase font-bold">
                    <Sparkles className="w-3 h-3 text-brand-600" />
                    <span>AI Reasoning & Resolution Strategy</span>
                    <span className="text-slate-400">• {log.strategyLayer}</span>
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
