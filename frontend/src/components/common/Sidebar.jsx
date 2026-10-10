import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Zap,
  LayoutDashboard,
  Play,
  Layers,
  FileText,
  ShoppingBag,
  Flame,
  AlertTriangle,
  Radio,
  Database,
} from 'lucide-react';
import { useTests } from '../../context/TestContext';

const navLinks = [
  { to: '/', label: 'Overview', icon: LayoutDashboard },
  { to: '/live', label: 'Live Runner', icon: Radio, badge: 'Live' },
  { to: '/studio', label: 'Test Studio', icon: Layers },
  { to: '/audit', label: 'Audit Trail', icon: FileText },
  { to: '/demo-store', label: 'Demo Store', icon: ShoppingBag, tag: 'Sandbox' },
];

const quickRuns = [
  { mode: 'standard', label: 'Version A — Baseline', icon: Play, color: 'text-gray-300 hover:text-white', note: 'PASS' },
  { mode: 'mutated', label: 'Version B — Auto-Heal', icon: Zap, color: 'text-indigo-400 hover:text-indigo-300', note: 'HEAL' },
  { mode: 'chaos', label: 'Live Chaos Mode', icon: Flame, color: 'text-amber-400 hover:text-amber-300', note: 'CHAOS' },
  { mode: 'bug_mode', label: 'Real Bug — Smart Triage', icon: AlertTriangle, color: 'text-red-400 hover:text-red-300', note: 'TRIAGE' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { socketConnected, systemHealth, tests, triggerRun } = useTests();
  const [running, setRunning] = useState(null);

  const defaultTest = tests[0] || null;

  const handleQuickRun = async (mode) => {
    setRunning(mode);
    try {
      await triggerRun(defaultTest?._id, mode, true);
      if (location.pathname !== '/live') navigate('/live');
    } catch (err) {
      console.error(err);
    } finally {
      setRunning(null);
    }
  };

  return (
    <aside className="w-64 bg-sidebar-bg border-r border-sidebar-border flex flex-col shrink-0 min-h-screen select-none">
      {/* Brand */}
      <div className="h-16 px-5 flex items-center gap-3 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center shadow-sm flex-shrink-0">
          <Zap className="w-4 h-4 text-white fill-current" />
        </div>
        <div className="min-w-0">
          <p className="text-base font-bold text-white leading-tight tracking-tight">AutoHeal Studio</p>
          <p className="text-xs text-sidebar-text-muted">HackWave 3.0 Platform</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto scrollbar-sidebar">
        <p className="px-3 mb-2.5 text-xs font-bold uppercase tracking-wider text-sidebar-text-muted">
          Workspace
        </p>
        {navLinks.map(({ to, label, icon: Icon, badge, tag }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors group ${
                isActive
                  ? 'bg-sidebar-active text-sidebar-text-active font-semibold shadow-xs'
                  : 'text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text-active'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-sidebar-text-muted group-hover:text-gray-200'}`} />
                  <span>{label}</span>
                </span>
                {badge && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-success/20 text-green-400 font-mono">
                    {badge}
                  </span>
                )}
                {tag && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white/10 text-sidebar-text-muted font-mono">
                    {tag}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}

        {/* Quick Runs */}
        <div className="pt-6">
          <p className="px-3 mb-2.5 text-xs font-bold uppercase tracking-wider text-sidebar-text-muted">
            Quick Launch
          </p>
          <div className="space-y-1">
            {quickRuns.map(({ mode, label, icon: Icon, color, note }) => (
              <button
                key={mode}
                onClick={() => handleQuickRun(mode)}
                disabled={!!running}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors group disabled:opacity-40 hover:bg-sidebar-hover ${color}`}
              >
                <span className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 flex-shrink-0 ${running === mode ? 'animate-spin' : ''}`} />
                  <span className="text-left truncate">{label}</span>
                </span>
                <span className="text-xs font-mono text-sidebar-text-muted shrink-0 font-semibold">{note}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* System Status */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="bg-white/5 rounded-xl p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-sidebar-text-muted font-mono">Telemetry</span>
            <span className={`flex items-center gap-1.5 text-xs font-mono font-semibold ${socketConnected ? 'text-green-400' : 'text-red-400'}`}>
              <span className={`w-2 h-2 rounded-full ${socketConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
              {socketConnected ? 'Connected' : 'Offline'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-sidebar-text-muted font-mono">Storage</span>
            <span className="text-xs text-sidebar-text font-mono flex items-center gap-1.5 font-medium">
              <Database className="w-3.5 h-3.5" />
              {systemHealth?.db?.connected ? 'MongoDB' : 'Memory Store'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-sidebar-text-muted font-mono">AI Engine</span>
            <span className="text-xs text-indigo-400 font-mono font-bold">Heuristic + LLM</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
