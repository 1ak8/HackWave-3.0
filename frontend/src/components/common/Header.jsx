import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ShoppingBag, ExternalLink, RotateCcw, Zap, Sparkles } from 'lucide-react';
import { useTests } from '../../context/TestContext';

export default function Header() {
  const location = useLocation();
  const { activeRun, refreshAll } = useTests();

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/':
        return { title: 'Platform Overview', subtitle: 'Autonomous E2E Testing Dashboard' };
      case '/live':
        return { title: 'Live Runner & Intent Graph', subtitle: 'Real-time test telemetry & visual healing' };
      case '/studio':
        return { title: 'Test Studio', subtitle: 'Author intent-based test specifications' };
      case '/audit':
        return { title: 'Compliance & Audit Trail', subtitle: 'Immutable log of healed selectors and triage actions' };
      default:
        return { title: 'AutoHeal Studio', subtitle: 'Intent-Aware E2E Testing Platform' };
    }
  };

  const { title, subtitle } = getPageTitle(location.pathname);

  return (
    <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-30 px-6 sm:px-8 flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      {/* Page Title & Breadcrumb */}
      <div>
        <h2 className="text-base font-extrabold text-slate-900 tracking-tight">{title}</h2>
        <p className="text-xs text-slate-500 font-medium -mt-0.5 hidden sm:block">{subtitle}</p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {activeRun && activeRun.status === 'running' && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-xs font-mono font-bold text-brand-700 animate-pulse">
            <Zap className="w-3.5 h-3.5 text-brand-600 fill-current" />
            <span>Test In Flight...</span>
          </div>
        )}

        <button
          onClick={refreshAll}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
          title="Refresh Data"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Sync</span>
        </button>

        <Link
          to="/demo-store"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition shadow-sm"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Demo Store</span>
          <ExternalLink className="w-3 h-3 text-brand-200" />
        </Link>
      </div>
    </header>
  );
}
