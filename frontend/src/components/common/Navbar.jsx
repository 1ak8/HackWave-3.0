import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  Zap, 
  Activity, 
  Layers, 
  FileText, 
  ShoppingBag, 
  Database,
  ExternalLink,
  GitBranch
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
    <nav className="border-b border-border bg-surface-raised sticky top-0 z-50 shadow-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-md bg-[#24292f] text-white flex items-center justify-center shadow-card group-hover:scale-105 transition-transform">
                <GitBranch className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm tracking-tight text-ink">
                  NexHeal
                </span>
                <span className="text-2xs font-mono px-1.5 py-0.2 rounded-full border border-border text-ink-secondary bg-surface">
                  public
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1 pl-4 border-l border-border">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-surface text-ink font-semibold border border-border shadow-card'
                          : 'text-ink-secondary hover:text-ink hover:bg-surface'
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
          <div className="flex items-center gap-2.5">
            {/* Live Socket Stream Indicator */}
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface border border-border text-2xs font-mono">
              <span className={`w-1.5 h-1.5 rounded-full ${socketConnected ? 'bg-[#1a7f37] animate-pulse' : 'bg-[#cf222e]'}`}></span>
              <span className={socketConnected ? 'text-[#1a7f37] font-medium' : 'text-[#cf222e]'}>
                {socketConnected ? 'Live Socket Stream' : 'Connecting...'}
              </span>
            </div>

            {/* DB Status Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface border border-border text-2xs font-mono text-ink-secondary">
              <Database className="w-3 h-3 text-accent" />
              <span>{systemHealth?.db?.connected ? 'MongoDB Active' : 'Zero-Setup Engine'}</span>
            </div>

            {/* Target App Sandbox Link */}
            <Link
              to="/demo-store"
              className="btn btn-primary btn-sm flex items-center gap-1"
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
