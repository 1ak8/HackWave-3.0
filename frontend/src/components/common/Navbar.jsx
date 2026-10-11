import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  Zap, 
  Activity, 
  Layers, 
  FileText, 
  ShoppingBag, 
  Radio, 
  Database,
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useTests } from '../../context/TestContext';

export default function Navbar() {
  const { socketConnected, systemHealth } = useTests();

  const navItems = [
    { label: 'Overview', to: '/', icon: Activity },
    { label: 'Live Runner & Intent Graph', to: '/live', icon: Zap },
    { label: 'Test Studio', to: '/studio', icon: Layers },
    { label: 'Audit Trail', to: '/audit', icon: FileText },
    { label: 'Target Demo Store', to: '/demo-store', icon: ShoppingBag }
  ];

  return (
    <nav className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/25 group-hover:scale-105 transition-transform">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-tight text-slate-900">
                    AutoHeal
                  </span>
                  <span className="text-2xs font-mono font-bold px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">
                    STUDIO
                  </span>
                </div>
                <span className="text-2xs text-slate-500 -mt-0.5 font-medium">Intent-Aware E2E Testing</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1 pl-4 border-l border-slate-200">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-brand-50 text-brand-700 border border-brand-200 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
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
            {/* Live Socket Stream Indicator */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-mono">
              <span className={`w-2 h-2 rounded-full ${socketConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-400'}`}></span>
              <span className={socketConnected ? 'text-emerald-700 font-semibold' : 'text-red-600'}>
                {socketConnected ? 'Live Socket Stream' : 'Connecting...'}
              </span>
            </div>

            {/* DB Status Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-mono text-slate-600">
              <Database className="w-3 h-3 text-brand-600" />
              <span>{systemHealth?.db?.connected ? 'MongoDB Active' : 'Zero-Setup Engine'}</span>
            </div>

            {/* Target App Sandbox Link */}
            <Link
              to="/demo-store"
              className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white transition shadow-sm"
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
