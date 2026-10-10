import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TestProvider } from './context/TestContext';
import Sidebar from './components/common/Sidebar';
import Header from './components/common/Header';
import Dashboard from './pages/Dashboard';
import LiveRunView from './pages/LiveRunView';
import TestStudio from './pages/TestStudio';
import HealingReport from './pages/HealingReport';
import DemoStore from './pages/DemoStore';

export default function App() {
  return (
    <BrowserRouter>
      <TestProvider>
        <Routes>
          {/* Dedicated full-viewport route for the Target Sandbox Demo Store */}
          <Route path="/demo-store" element={<DemoStore />} />

          {/* Core SaaS Suite Layout with Left Sidebar + Top Header */}
          <Route
            path="*"
            element={
              <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans selection:bg-brand-500/20 selection:text-brand-800">
                {/* Left Fixed Sidebar */}
                <Sidebar />

                {/* Main View Area */}
                <div className="flex-1 flex flex-col min-w-0">
                  <Header />
                  <main className="flex-1 pb-16 overflow-y-auto">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/live" element={<LiveRunView />} />
                      <Route path="/studio" element={<TestStudio />} />
                      <Route path="/audit" element={<HealingReport />} />
                    </Routes>
                  </main>
                </div>
              </div>
            }
          />
        </Routes>
      </TestProvider>
    </BrowserRouter>
  );
}
