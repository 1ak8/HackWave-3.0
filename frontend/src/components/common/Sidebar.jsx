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
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { useTests } from '../../context/TestContext';

const navLinks = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/live', label: 'Live Test Runner', icon: Radio, badge: 'Live' },
  { to: '/studio', label: 'Test Studio', icon: Layers },
  { to: '/audit', label: 'Audit Trail', icon: FileText },
  { to: '/demo-store', label: 'Demo Store', icon: ShoppingBag, tag: 'Sandbox' },
];

const quickRuns = [
  { 
    mode: 'mutated', 
    label: 'Auto-Heal', 
    sub: 'AI Repair', 
    icon: Zap, 
    style: 'text-brand bg-brand-light/70 hover:bg-brand-light border-brand-border/60 hover:border-brand-border text-brand shadow-2xs' 
  },
  { 
    mode: 'standard', 
    label: 'Standard', 
    sub: 'Baseline Pass', 
    icon: Play, 
    style: 'text-ink-secondary bg-surface-raised hover:bg-surface border-border hover:border-border-strong shadow-2xs' 
  },
  { 
    mode: 'chaos', 
    label: 'Live Chaos', 
    sub: 'Runtime Glitch', 
    icon: Flame, 
    style: 'text-amber-800 bg-amber-50/70 hover:bg-amber-50 border-amber-200/70 hover:border-amber-300 shadow-2xs' 
  },
  { 
    mode: 'bug_mode', 
    label: 'Real Bug', 
    sub: 'Smart Triage', 
    icon: AlertTriangle, 
    style: 'text-red-800 bg-red-50/70 hover:bg-red-50 border-red-200/70 hover:border-red-300 shadow-2xs' 
  },
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
    <aside className="fixed left-0 top-0 bottom-0 w-64 h-screen bg-surface-raised border-r border-border flex flex-col justify-between z-40 select-none shadow-card">
      {/* Upper Section */}
      <div className="flex flex-col min-h-0 overflow-y-auto scrollbar-none">
        {/* Brand Studio Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-border/80 bg-surface/30 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600 flex items-center justify-center shadow-sm shadow-orange-500/25 shrink-0 text-white">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base text-ink tracking-tight">NexHeal</span>
              </div>
              <p className="text-2xs text-ink-tertiary truncate">Intent-Aware E2E Engine</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="px-3 pt-4 pb-2 space-y-1">
          <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-ink-tertiary/80 font-mono">
            Navigation
          </p>
          {navLinks.map(({ to, label, icon: Icon, badge, tag }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-surface text-ink font-bold border border-border shadow-xs'
                    : 'text-ink-secondary hover:text-ink hover:bg-surface/60'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-brand' : 'text-ink-tertiary group-hover:text-ink'
                    }`} />
                    <span className="truncate">{label}</span>
                  </span>
                  {badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-mono flex items-center gap-1 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      {badge}
                    </span>
                  )}
                  {tag && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-surface text-ink-tertiary border border-border/80 font-mono shrink-0">
                      {tag}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* 2x2 Quick Test Launch Control Deck */}
        <div className="px-3 pt-3 pb-2">
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-tertiary/80 font-mono">
              Quick Launch Deck
            </span>
            <span className="text-2xs text-ink-tertiary font-mono">1-Click</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {quickRuns.map(({ mode, label, sub, icon: Icon, style }) => (
              <button
                key={mode}
                onClick={() => handleQuickRun(mode)}
                disabled={!!running}
                className={`p-2.5 rounded-xl border text-left transition-all duration-150 disabled:opacity-40 group flex flex-col justify-between min-h-[62px] ${style}`}
                title={`Launch ${label} test run`}
              >
                <div className="flex items-center justify-between w-full">
                  <Icon className={`w-3.5 h-3.5 shrink-0 transition-transform group-hover:scale-110 ${
                    running === mode ? 'animate-spin' : ''
                  }`} />
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" />
                </div>
                <div>
                  <p className="text-xs font-bold leading-tight truncate">{label}</p>
                  <p className="text-[10px] opacity-75 font-mono truncate">{sub}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* System Status Telemetry Footer */}
      <div className="p-3 border-t border-border/80 bg-surface/30 shrink-0">
        <div className="bg-surface-raised border border-border rounded-xl p-2.5 space-y-2 text-2xs font-mono shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-ink-tertiary flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-brand" />
              <span>Telemetry:</span>
            </span>
            <span className={`flex items-center gap-1 font-bold px-1.5 py-0.5 rounded-full ${
              socketConnected 
                ? 'text-emerald-700 bg-emerald-50 border border-emerald-200/70' 
                : 'text-red-600 bg-red-50 border border-red-200/70'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${socketConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
              <span>{socketConnected ? 'Live' : 'Offline'}</span>
            </span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-border/60">
            <span className="text-ink-tertiary flex items-center gap-1.5">
              <Database className="w-3 h-3" />
              <span>Storage:</span>
            </span>
            <span className="text-ink font-semibold">
              {systemHealth?.db?.connected ? 'MongoDB' : 'Disk Persist'}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
