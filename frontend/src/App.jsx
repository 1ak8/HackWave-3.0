import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TestProvider } from './context/TestContext';
import Navbar from './components/common/Navbar';
import Dashboard from './pages/Dashboard';
import LiveRunView from './pages/LiveRunView';
import TestStudio from './pages/TestStudio';
import HealingReport from './pages/HealingReport';
import DemoStore from './pages/DemoStore';

export default function App() {
  return (
    <BrowserRouter>
      <TestProvider>
        <div className="min-h-screen bg-obsidian-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
          <Routes>
            {/* Dedicated fullscreen route for the Target Sandbox Demo Store */}
            <Route path="/demo-store" element={<DemoStore />} />

            {/* Standard SaaS Shell for Testing Dashboard & Studio */}
            <Route
              path="*"
              element={
                <>
                  <Navbar />
                  <main className="flex-1 pb-16">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/live" element={<LiveRunView />} />
                      <Route path="/studio" element={<TestStudio />} />
                      <Route path="/audit" element={<HealingReport />} />
                    </Routes>
                  </main>
                  <footer className="border-t border-white/5 py-6 bg-obsidian-950 text-center text-xs text-slate-600 font-mono">
                    AutoHeal Studio • Intent-Aware End-to-End Testing Suite • HackWave 3.0
                  </footer>
                </>
              }
            />
          </Routes>
        </div>
      </TestProvider>
    </BrowserRouter>
  );
}
