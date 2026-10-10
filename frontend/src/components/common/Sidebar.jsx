import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Zap, 
  Activity, 
  Layers, 
  FileText, 
  ShoppingBag, 
  Play, 
  Flame, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  Database,
  Radio,
  Cpu
} from 'lucide-react';
import { useTests } from '../../context/TestContext';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { socketConnected, systemHealth, tests, triggerRun } = useTests();
  const [quickRunning, setQuickRunning] = useState(false);

  const defaultTest = tests[0] || null;

  const handleQuickRun = async (mode) => {
    setQuickRunning(true);
    try {
      await triggerRun(defaultTest?._id, mode, true);
      if (location.pathname !== '/live') {
        navigate('/live');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setQuickRunning(false);
    }
  };

  const navLinks = [
    { to: '/', label: 'Overview', icon: Activity, description: 'Metrics & health' },
    { to: '/live', label: 'Live Runner', icon: Zap, description: 'Intent Graph & console', badge: 'Active' },
    { to: '/studio', label: 'Test Studio', icon: Layers, description: 'Author test suites' },
    { to: '/audit', label: 'Audit Trail', icon: FileText, description: 'Healed selectors log' },
    { to: '/demo-store', label: 'Target Demo Store', icon: ShoppingBag, description: 'E-commerce sandbox', highlight: true }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen flex flex-col justify-between shrink-0 z-40 select-none shadow-[1px_0_3px_rgba(0,0,0,0.02)]">
      {/* Top Brand Section */}
      <div>
        <div className="h-16 border-b border-slate-200 px-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/25">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900">
                  AutoHeal
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">
                  v3.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium -mt-0.5">Intent-Aware E2E</p>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="px-3 py-4 space-y-1">
          <span className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Platform Navigation
          </span>
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 shadow-sm border border-brand-200/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 transition-colors ${item.highlight ? 'text-brand-600' : 'text-slate-500 group-hover:text-slate-800'}`} />
                  <div>
                    <span className="block">{item.label}</span>
                  </div>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {item.badge}
                  </span>
                )}
                {item.highlight && (
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-brand-100 text-brand-800 border border-brand-200">
                    APP
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Quick Execution Launcher Section */}
        <div className="px-3 py-3 border-t border-slate-100">
          <span className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
            Quick Launch Tests
          </span>
          <div className="space-y-1.5">
            <button
              onClick={() => handleQuickRun('standard')}
              disabled={quickRunning}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition flex items-center justify-between group disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                <Play className="w-3.5 h-3.5 text-slate-600 fill-current" />
                <span>Version A (Base)</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 group-hover:text-slate-600 font-bold">PASS</span>
            </button>

            <button
              onClick={() => handleQuickRun('mutated')}
              disabled={quickRunning}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold bg-brand-50 hover:bg-brand-100 text-brand-800 border border-brand-200/80 transition flex items-center justify-between group disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-brand-600 fill-current" />
                <span>Version B (Heal)</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-brand-600">AUTO</span>
            </button>

            <button
              onClick={() => handleQuickRun('chaos')}
              disabled={quickRunning}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200/80 transition flex items-center justify-between group disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                <Flame className="w-3.5 h-3.5 text-rose-600" />
                <span>Live Chaos Mode</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-rose-600">FEAT 1</span>
            </button>

            <button
              onClick={() => handleQuickRun('bug_mode')}
              disabled={quickRunning}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-800 border border-red-200/80 transition flex items-center justify-between group disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                <span>Real Bug Mode</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-red-600">FEAT 3</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Status Panel */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/80 space-y-3">
        {/* Socket Status */}
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-500 text-[11px] font-medium">Socket Stream:</span>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${socketConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-400'}`}></span>
            <span className={`font-bold text-[11px] ${socketConnected ? 'text-emerald-700' : 'text-red-600'}`}>
              {socketConnected ? 'LIVE' : 'OFFLINE'}
            </span>
          </div>
        </div>

        {/* Engine Badge */}
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-500 text-[11px] font-medium">Engine Mode:</span>
          <span className="text-brand-700 font-bold text-[11px] bg-brand-50 px-1.5 py-0.5 rounded border border-brand-200">
            Heuristic + AI
          </span>
        </div>

        {/* Database Engine */}
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-500 text-[11px] font-medium">Storage:</span>
          <span className="text-slate-700 font-bold text-[11px]">
            {systemHealth?.db?.connected ? 'MongoDB' : 'Memory Engine'}
          </span>
        </div>
      </div>
    </aside>
  );
}
