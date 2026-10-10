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
    { to: '/', label: 'Overview', icon: Activity },
    { to: '/live', label: 'Live Runner', icon: Zap, badge: 'Live' },
    { to: '/studio', label: 'Test Studio', icon: Layers },
    { to: '/audit', label: 'Audit Trail', icon: FileText },
    { to: '/demo-store', label: 'Demo Store', icon: ShoppingBag, isApp: true }
  ];

  return (
    <aside className="w-64 bg-white/70 backdrop-blur-2xl border-r border-black/[0.06] min-h-screen flex flex-col justify-between shrink-0 z-40 select-none shadow-[1px_0_12px_rgba(0,0,0,0.02)]">
      {/* Top Brand Section */}
      <div>
        <div className="h-16 px-5 flex items-center justify-between border-b border-black/[0.04]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-apple-blue flex items-center justify-center text-white shadow-md shadow-apple-blue/20">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[15px] tracking-tight text-apple-text">
                  AutoHeal
                </span>
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-full bg-apple-blue/10 text-apple-blue">
                  3.0
                </span>
              </div>
              <p className="text-[11px] text-apple-secondary font-normal -mt-0.5">Intent-Aware Suite</p>
            </div>
          </div>
        </div>

        {/* Navigation Links (macOS Sidebar style) */}
        <div className="px-3 py-4 space-y-1">
          <span className="px-3 text-[10px] font-mono font-semibold uppercase tracking-wider text-apple-tertiary block mb-2">
            Workspace
          </span>
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all group ${
                    isActive
                      ? 'bg-apple-blue text-white shadow-[0_2px_8px_rgba(0,113,227,0.25)] font-semibold'
                      : 'text-apple-secondary hover:text-apple-text hover:bg-black/[0.03]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-apple-secondary group-hover:text-apple-text'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-white/20 text-white' : 'bg-apple-green-light text-apple-green border border-apple-green/20'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    {item.isApp && (
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-white/20 text-white' : 'bg-black/[0.04] text-apple-secondary'
                      }`}>
                        TARGET
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Quick Launch Control Center */}
        <div className="px-3 py-3 border-t border-black/[0.04]">
          <span className="px-3 text-[10px] font-mono font-semibold uppercase tracking-wider text-apple-tertiary block mb-2.5">
            Quick Runs
          </span>
          <div className="space-y-1.5">
            <button
              onClick={() => handleQuickRun('standard')}
              disabled={quickRunning}
              className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium bg-black/[0.02] hover:bg-black/[0.05] text-apple-text transition flex items-center justify-between group active:scale-[0.98] disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                <Play className="w-3.5 h-3.5 text-apple-secondary fill-current" />
                <span>Version A (Base)</span>
              </div>
              <span className="text-[10px] font-mono text-apple-tertiary font-medium">PASS</span>
            </button>

            <button
              onClick={() => handleQuickRun('mutated')}
              disabled={quickRunning}
              className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium bg-apple-blue/5 hover:bg-apple-blue/10 text-apple-blue border border-apple-blue/15 transition flex items-center justify-between group active:scale-[0.98] disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-apple-blue fill-current" />
                <span>Version B (Heal)</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-apple-blue">AUTO</span>
            </button>

            <button
              onClick={() => handleQuickRun('chaos')}
              disabled={quickRunning}
              className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium bg-apple-orange-light hover:bg-apple-orange/15 text-apple-orange border border-apple-orange/20 transition flex items-center justify-between group active:scale-[0.98] disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                <Flame className="w-3.5 h-3.5 text-apple-orange" />
                <span>Live Chaos Mode</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-apple-orange">FEAT 1</span>
            </button>

            <button
              onClick={() => handleQuickRun('bug_mode')}
              disabled={quickRunning}
              className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium bg-apple-red-light hover:bg-apple-red/15 text-apple-red border border-apple-red/20 transition flex items-center justify-between group active:scale-[0.98] disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-apple-red" />
                <span>Real Bug Mode</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-apple-red">FEAT 3</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Frosted Status Widget */}
      <div className="p-3.5 m-3 rounded-2xl bg-white/80 border border-black/[0.04] shadow-sm space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-apple-secondary text-[11px]">Telemetry:</span>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${socketConnected ? 'bg-apple-green animate-pulse' : 'bg-apple-red'}`}></span>
            <span className={`font-semibold text-[11px] ${socketConnected ? 'text-apple-green' : 'text-apple-red'}`}>
              {socketConnected ? 'Connected' : 'Offline'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-apple-secondary text-[11px]">AI Model:</span>
          <span className="text-apple-blue font-semibold text-[11px]">
            Heuristic + LLM
          </span>
        </div>

        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-apple-secondary text-[11px]">Storage:</span>
          <span className="text-apple-text font-semibold text-[11px]">
            {systemHealth?.db?.connected ? 'MongoDB' : 'Memory Store'}
          </span>
        </div>
      </div>
    </aside>
  );
}
