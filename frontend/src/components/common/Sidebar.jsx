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
  ChevronRight,
  GitBranch,
} from 'lucide-react';
import { useTests } from '../../context/TestContext';

const navLinks = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/live', label: 'Live Runner', icon: Radio, badge: 'Live' },
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
    iconColor: 'text-[#0969da]',
  },
  { 
    mode: 'standard', 
    label: 'Standard', 
    sub: 'Baseline Pass', 
    icon: Play, 
    iconColor: 'text-[#1a7f37]',
  },
  { 
    mode: 'chaos', 
    label: 'Live Chaos', 
    sub: 'Runtime Glitch', 
    icon: Flame, 
    iconColor: 'text-[#9a6700]',
  },
  { 
    mode: 'bug_mode', 
    label: 'Real Bug', 
    sub: 'Smart Triage', 
    icon: AlertTriangle, 
    iconColor: 'text-[#cf222e]',
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { socketConnected, systemHealth, tests, triggerRun } = useTests();
  const [running, setRunning] = useState(null);

  const defaultTest = tests.find(t => t._id === 'test_default_ecommerce_flow' || t.isSample || t.steps?.length === 6) || tests[0] || null;

  const handleQuickRun = async (mode) => {
    setRunning(mode);
    try {
      await triggerRun(defaultTest?._id, mode, true, { targetUrl: `${window.location.origin}/demo-store` });
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
        {/* GitHub Style Header */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-border bg-surface shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-md bg-[#24292f] text-white flex items-center justify-center shadow-card shrink-0">
              <GitBranch className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex items-center gap-2">
              <span className="font-semibold text-sm text-ink tracking-tight">NexHeal</span>
              <span className="text-2xs font-mono px-1.5 py-0.2 rounded-full border border-border text-ink-secondary bg-surface-raised">
                public
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="px-3 pt-3 pb-2 space-y-0.5">
          <p className="px-2 mb-1.5 text-2xs font-semibold uppercase tracking-wider text-ink-tertiary font-mono">
            Repositories & Tools
          </p>
          {navLinks.map(({ to, label, icon: Icon, badge, tag }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors group ${
                  isActive
                    ? 'bg-surface text-ink font-semibold border border-border shadow-card'
                    : 'text-ink-secondary hover:text-ink hover:bg-surface/80'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-accent' : 'text-ink-tertiary group-hover:text-ink'
                    }`} />
                    <span className="truncate">{label}</span>
                  </span>
                  {badge && (
                    <span className="text-2xs font-mono font-medium px-1.5 py-0.5 rounded-full bg-[#dafbe1] text-[#1a7f37] border border-[#4ac26b] flex items-center gap-1 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1a7f37] animate-pulse"></span>
                      {badge}
                    </span>
                  )}
                  {tag && (
                    <span className="text-2xs font-mono px-1.5 py-0.5 rounded-full bg-surface text-ink-tertiary border border-border shrink-0">
                      {tag}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* 2x2 Quick Test Launch Control Deck */}
        <div className="px-3 pt-2 pb-2">
          <div className="flex items-center justify-between px-2 mb-1.5">
            <span className="text-2xs font-semibold uppercase tracking-wider text-ink-tertiary font-mono">
              Workflow Dispatch
            </span>
            <span className="text-2xs text-ink-tertiary font-mono">1-click</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {quickRuns.map(({ mode, label, sub, icon: Icon, iconColor }) => (
              <button
                key={mode}
                onClick={() => handleQuickRun(mode)}
                disabled={!!running}
                className="p-2 rounded-md border border-border bg-surface-raised hover:bg-surface hover:border-border-strong text-left transition-colors disabled:opacity-40 group flex flex-col justify-between min-h-[58px] shadow-card"
                title={`Launch ${label} test run`}
              >
                <div className="flex items-center justify-between w-full">
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${iconColor} ${
                    running === mode ? 'animate-spin' : ''
                  }`} />
                  <ChevronRight className="w-3 h-3 text-ink-tertiary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-ink leading-tight truncate">{label}</p>
                  <p className="text-2xs text-ink-secondary font-mono truncate">{sub}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* System Status Telemetry Footer */}
      <div className="p-3 border-t border-border bg-surface shrink-0">
        <div className="bg-surface-raised border border-border rounded-md p-2 space-y-1.5 text-2xs font-mono shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-ink-secondary flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-accent" />
              <span>Telemetry:</span>
            </span>
            <span className={`flex items-center gap-1 font-medium px-1.5 py-0.5 rounded-full ${
              socketConnected 
                ? 'text-[#1a7f37] bg-[#dafbe1] border border-[#4ac26b]' 
                : 'text-[#cf222e] bg-[#ffebe9] border border-[#ff8182]'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${socketConnected ? 'bg-[#1a7f37] animate-pulse' : 'bg-[#cf222e]'}`} />
              <span>{socketConnected ? 'online' : 'offline'}</span>
            </span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-border">
            <span className="text-ink-secondary flex items-center gap-1.5">
              <Database className="w-3 h-3" />
              <span>Storage:</span>
            </span>
            <span className="text-ink font-medium">
              {systemHealth?.db?.connected ? 'MongoDB' : 'Disk Persist'}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
