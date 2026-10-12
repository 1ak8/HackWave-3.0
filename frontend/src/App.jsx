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
        {/* Main App Layout with Fixed Locked Sidebar on All Pages (Including Demo Store) */}
        <div className="min-h-screen bg-canvas text-ink font-sans selection:bg-[#ddf4ff] selection:text-[#0969da]">
          {/* 100% Fixed Locked Left Sidebar */}
          <Sidebar />

          {/* Right Content Area with Left Offset */}
          <div className="pl-64 min-h-screen flex flex-col min-w-0">
            <Header />
            <main className="flex-1 pb-16">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/live" element={<LiveRunView />} />
                <Route path="/studio" element={<TestStudio />} />
                <Route path="/audit" element={<HealingReport />} />
                <Route path="/demo-store" element={<DemoStore />} />
              </Routes>
            </main>
          </div>
        </div>
      </TestProvider>
    </BrowserRouter>
  );
}
