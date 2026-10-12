import React from 'react';
import { useLocation } from 'react-router-dom';
import { RefreshCw, Zap } from 'lucide-react';
import { useTests } from '../../context/TestContext';

export default function Header() {
  const location = useLocation();
  const { activeRun, refreshAll } = useTests();

  const getPageInfo = (pathname) => {
    switch (pathname) {
      case '/':
        return { section: 'dashboard', title: 'Test Orchestration Overview' };
      case '/live':
        return { section: 'actions', title: 'Real-time Autonomous Runner' };
      case '/studio':
        return { section: 'authoring', title: 'Intent Specification Studio' };
      case '/audit':
        return { section: 'security', title: 'Repair Audit Log & Triage' };
      case '/demo-store':
        return { section: 'sandbox', title: 'Target E-Commerce Testing Ground' };
      default:
        return { section: 'app', title: 'NexHeal' };
    }
  };

  const { section, title } = getPageInfo(location.pathname);

  return (
    <header className="h-14 bg-surface-raised border-b border-border sticky top-0 z-30 px-6 sm:px-8 flex items-center justify-between shadow-card">
      {/* GitHub Repository Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs sm:text-sm">
        <span className="font-semibold text-accent hover:underline cursor-default">nexheal</span>
        <span className="text-ink-tertiary">/</span>
        <span className="font-medium text-ink-secondary">{section}</span>
        <span className="text-ink-tertiary">/</span>
        <span className="font-semibold text-ink">{title}</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {activeRun && activeRun.status === 'running' && (
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#fff8c5] border border-[#d4a72c] text-2xs font-mono font-medium text-[#9a6700]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9a6700] animate-pulse" />
            <span>Workflow Active</span>
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
      </div>
    </header>
  );
}
