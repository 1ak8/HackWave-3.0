import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ShoppingBag, ExternalLink, RotateCcw, Zap } from 'lucide-react';
import { useTests } from '../../context/TestContext';

export default function Header() {
  const location = useLocation();
  const { activeRun, refreshAll } = useTests();

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/':
        return { title: 'Overview', subtitle: 'Autonomous E2E Testing Dashboard' };
      case '/live':
        return { title: 'Live Runner', subtitle: 'Real-time telemetry and dynamic healing' };
      case '/studio':
        return { title: 'Test Studio', subtitle: 'Author intent-based test suites' };
      case '/audit':
        return { title: 'Audit Trail', subtitle: 'Permanent record of healed selectors and triage logs' };
      default:
        return { title: 'AutoHeal Studio', subtitle: 'Intent-Aware E2E Testing Platform' };
    }
  };

  const { title, subtitle } = getPageTitle(location.pathname);

  return (
    <header className="h-16 bg-[#f5f5f7]/80 backdrop-blur-2xl border-b border-black/[0.05] sticky top-0 z-30 px-6 sm:px-8 flex items-center justify-between">
      {/* Title & Subtitle */}
      <div>
        <h2 className="text-base font-bold text-apple-text tracking-tight">{title}</h2>
        <p className="text-[11px] text-apple-secondary font-normal -mt-0.5 hidden sm:block">{subtitle}</p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {activeRun && activeRun.status === 'running' && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-apple-blue-light border border-apple-blue/20 text-xs font-mono font-semibold text-apple-blue animate-pulse">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Test In Flight...</span>
          </div>
        )}

        <button
          onClick={refreshAll}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-black/[0.08] bg-white/80 hover:bg-white text-apple-text text-xs font-medium transition shadow-apple-sm active:scale-95"
          title="Refresh Data"
        >
          <RotateCcw className="w-3 h-3 text-apple-secondary" />
          <span>Sync</span>
        </button>

        <Link
          to="/demo-store"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-apple-blue hover:bg-apple-blue-hover text-white text-xs font-semibold transition shadow-sm active:scale-95"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Sandbox Store</span>
          <ExternalLink className="w-3 h-3 opacity-75" />
        </Link>
      </div>
    </header>
  );
}
