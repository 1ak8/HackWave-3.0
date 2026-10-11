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
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/live', label: 'Live Test Runner', icon: Radio, badge: 'Live' },
  { to: '/studio', label: 'Test Studio', icon: Layers },
  { to: '/audit', label: 'Audit Log', icon: FileText },
  { to: '/demo-store', label: 'Demo Store', icon: ShoppingBag, tag: 'App' },
];

const quickRuns = [
  { mode: 'mutated', label: 'Auto-Heal Demo', icon: Zap, color: 'text-brand hover:text-white bg-brand/10 hover:bg-brand/20', note: 'AI HEAL' },
  { mode: 'standard', label: 'Standard Run', icon: Play, color: 'text-ink-secondary hover:text-white hover:bg-sidebar-hover', note: 'BASE' },
  { mode: 'chaos', label: 'Live Chaos Run', icon: Flame, color: 'text-amber-400 hover:text-white hover:bg-amber-500/10', note: 'CHAOS' },
  { mode: 'bug_mode', label: 'Real Bug Triage', icon: AlertTriangle, color: 'text-red-400 hover:text-white hover:bg-red-500/10', note: 'TRIAGE' },
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
    <aside className="fixed left-0 top-0 bottom-0 w-64 h-screen bg-sidebar-bg border-r border-sidebar-border flex flex-col justify-between z-40 select-none shadow-md">
      {/* Brand Header */}
      <div>
        <div className="h-16 px-5 flex items-center gap-3 border-b border-sidebar-border">
          <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center shadow-sm flex-shrink-0">
            <Zap className="w-4 h-4 text-white fill-current" />
          </div>
          <div className="min-w-0">
            <p className="text-base font-bold text-white leading-tight tracking-tight">AutoHeal Studio</p>
            <p className="text-xs text-sidebar-text-muted">Self-Healing E2E Tests</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="px-3 py-4 space-y-1">
          <p className="px-3 mb-2 text-xs font-bold uppercase tracking-wider text-sidebar-text-muted">
            Menu
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
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-surface-raised/10 text-sidebar-text-muted font-mono">
                      {tag}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Quick Launch Buttons */}
        <div className="px-3 pt-2">
          <p className="px-3 mb-2 text-xs font-bold uppercase tracking-wider text-sidebar-text-muted">
            1-Click Run
          </p>
          <div className="space-y-1.5">
            {quickRuns.map(({ mode, label, icon: Icon, color, note }) => (
              <button
                key={mode}
                onClick={() => handleQuickRun(mode)}
                disabled={!!running}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 ${color}`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 flex-shrink-0 ${running === mode ? 'animate-spin' : ''}`} />
                  <span className="text-left truncate font-semibold">{label}</span>
                </span>
                <span className="text-xs font-mono font-bold shrink-0">{note}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* System Status Footer */}
      <div className="p-3 border-t border-sidebar-border">
        <div className="bg-surface-raised/5 rounded-xl p-3 space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between">
            <span className="text-sidebar-text-muted">Telemetry:</span>
            <span className={`flex items-center gap-1.5 font-bold ${socketConnected ? 'text-green-400' : 'text-red-400'}`}>
              <span className={`w-2 h-2 rounded-full ${socketConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
              {socketConnected ? 'Connected' : 'Offline'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sidebar-text-muted">Storage:</span>
            <span className="text-sidebar-text font-medium flex items-center gap-1">
              <Database className="w-3.5 h-3.5" />
              {systemHealth?.db?.connected ? 'MongoDB' : 'Memory'}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
