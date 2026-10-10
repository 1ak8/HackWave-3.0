import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ShoppingBag, ExternalLink, RefreshCw, Zap, ChevronRight } from 'lucide-react';
import { useTests } from '../../context/TestContext';

export default function Header() {
  const location = useLocation();
  const { activeRun, refreshAll } = useTests();

  const getPageInfo = (pathname) => {
    switch (pathname) {
      case '/':
        return { section: 'Dashboard', title: 'Test Orchestration Overview' };
      case '/live':
        return { section: 'Execution', title: 'Real-time Autonomous Runner' };
      case '/studio':
        return { section: 'Authoring', title: 'Intent Specification Studio' };
      case '/audit':
        return { section: 'Compliance', title: 'Repair Audit Log & Triage' };
      default:
        return { section: 'App', title: 'AutoHeal Studio' };
    }
  };

  const { section, title } = getPageInfo(location.pathname);

  return (
    <header className="h-16 bg-white border-b border-border sticky top-0 z-30 px-6 sm:px-8 flex items-center justify-between shadow-xs">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2.5">
        <span className="font-bold text-ink-tertiary uppercase tracking-wider text-xs">{section}</span>
        <ChevronRight className="w-4 h-4 text-ink-tertiary" />
        <span className="font-bold text-ink text-base tracking-tight">{title}</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {activeRun && activeRun.status === 'running' && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-light border border-brand-border text-xs font-mono font-semibold text-brand animate-pulse">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Test In Flight...</span>
          </div>
        )}

        <button
          onClick={refreshAll}
          className="btn btn-secondary btn-sm"
          title="Refresh Data"
        >
          <RefreshCw className="w-4 h-4 text-ink-secondary" />
          <span>Sync</span>
        </button>

        <Link
          to="/demo-store"
          className="btn btn-primary btn-sm"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Sandbox Store</span>
          <ExternalLink className="w-3.5 h-3.5 text-white/70" />
        </Link>
      </div>
    </header>
  );
}
