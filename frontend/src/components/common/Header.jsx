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
    <header className="h-14 bg-canvas border-b border-border sticky top-0 z-30 px-6 flex items-center justify-between">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs">
        <span className="font-semibold text-ink-tertiary uppercase tracking-wider text-2xs">{section}</span>
        <ChevronRight className="w-3.5 h-3.5 text-ink-tertiary" />
        <span className="font-semibold text-ink text-sm">{title}</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {activeRun && activeRun.status === 'running' && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-brand-light border border-brand-border text-xs font-mono font-medium text-brand animate-pulse">
            <Zap className="w-3 h-3 fill-current" />
            <span>Test In Flight</span>
          </div>
        )}

        <button
          onClick={refreshAll}
          className="btn btn-secondary btn-sm"
          title="Refresh Data"
        >
          <RefreshCw className="w-3.5 h-3.5 text-ink-secondary" />
          <span>Sync</span>
        </button>

        <Link
          to="/demo-store"
          className="btn btn-primary btn-sm"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Target App</span>
          <ExternalLink className="w-3 h-3 text-white/70" />
        </Link>
      </div>
    </header>
  );
}
