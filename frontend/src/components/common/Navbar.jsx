import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  Zap, 
  Activity, 
  Layers, 
  FileText, 
  ShoppingBag, 
  CheckCircle, 
  Radio, 
  Database,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useTests } from '../../context/TestContext';

export default function Navbar() {
  const { socketConnected, systemHealth } = useTests();

  const navItems = [
    { label: 'Overview', to: '/', icon: Activity },
    { label: 'Live Runner & Intent Graph', to: '/live', icon: Zap },
    { label: 'Test Studio', to: '/studio', icon: Layers },
    { label: 'Audit Trail', to: '/audit', icon: FileText },
    { label: 'Target Demo Store', to: '/demo-store', icon: ShoppingBag, external: false }
  ];

  return (
    <nav className="border-b border-white/10 bg-obsidian-950/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-obsidian-950 shadow-[0_0_20px_rgba(16,185,129,0.35)] group-hover:scale-105 transition-transform">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                  AUTOHEAL<span className="text-emerald-400 font-mono font-medium text-xs px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/20">STUDIO</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono -mt-0.5">Intent-Aware E2E Testing</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1 pl-4 border-l border-white/10">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                      }`
                    }
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* Right Status Indicators */}
          <div className="flex items-center gap-3">
            {/* Live Socket Status */}
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-obsidian-900 border border-white/10 text-[11px] font-mono">
              <span className={`w-2 h-2 rounded-full ${socketConnected ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`}></span>
              <span className={socketConnected ? 'text-emerald-300' : 'text-red-400'}>
                {socketConnected ? 'Live Socket Stream' : 'Connecting...'}
              </span>
            </div>

            {/* DB Health Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-obsidian-900 border border-white/10 text-[11px] font-mono text-slate-300">
              <Database className="w-3 h-3 text-emerald-400" />
              <span>{systemHealth?.db?.connected ? 'MongoDB Active' : 'Memory Engine'}</span>
            </div>

            {/* Target App Quick Trigger */}
            <Link
              to="/demo-store"
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-obsidian-950 transition shadow-sm"
            >
              <span>Sandbox Store</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
