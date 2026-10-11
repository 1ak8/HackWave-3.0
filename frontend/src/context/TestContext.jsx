import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { getSocket } from '../api/socketClient';

const TestContext = createContext();

export function TestProvider({ children }) {
  const [tests, setTests] = useState([]);
  const [runs, setRuns] = useState([]);
  const [activeRun, setActiveRun] = useState(null);
  const [healingLogs, setHealingLogs] = useState([]);
  const [stats, setStats] = useState({
    totalRuns: 0,
    passedRuns: 0,
    healedRuns: 0,
    failedRuns: 0,
    totalHeals: 0,
    genuineBugsBlocked: 0,
    healingSuccessRate: 98,
    hoursSaved: '0',
    costSaved: 0
  });
  const [systemHealth, setSystemHealth] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState([]);

  // Fetch initial data
  const refreshAll = async () => {
    try {
      const [testsRes, runsRes, statsRes, logsRes, healthRes] = await Promise.allSettled([
        apiClient.get('/tests'),
        apiClient.get('/runs'),
        apiClient.get('/reports/stats'),
        apiClient.get('/reports/healing-logs'),
        apiClient.get('/health')
      ]);

      if (testsRes.status === 'fulfilled') setTests(testsRes.value.data.tests || []);
      if (runsRes.status === 'fulfilled') {
        setRuns(runsRes.value.data.runs || []);
        if (runsRes.value.data.runs && runsRes.value.data.runs.length > 0) {
          setActiveRun(prev => {
            if (!prev) return runsRes.value.data.runs[0];
            const matching = runsRes.value.data.runs.find(r => r._id === prev._id);
            return matching || runsRes.value.data.runs[0];
          });
        }
      }
      if (statsRes.status === 'fulfilled') setStats(statsRes.value.data.stats || stats);
      if (logsRes.status === 'fulfilled') setHealingLogs(logsRes.value.data.logs || []);
      if (healthRes.status === 'fulfilled') setSystemHealth(healthRes.value.data);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    }
  };

  useEffect(() => {
    refreshAll();
  }, []);

  // Socket.io telemetry setup
  useEffect(() => {
    const socket = getSocket();

    socket.on('connect', () => {
      setSocketConnected(true);
      addTerminalLog('info', `Connected to Real-Time Telemetry Socket (${socket.id})`);
    });

    socket.on('disconnect', () => {
      setSocketConnected(false);
      addTerminalLog('warn', 'Disconnected from Real-Time Telemetry Socket');
    });

    socket.on('run_status_changed', (payload) => {
      addTerminalLog('info', `Run [${payload.runId}] status: ${payload.status.toUpperCase()} (${payload.mode || 'standard'} mode)`);
      setActiveRun(prev => prev && prev._id === payload.runId ? { ...prev, status: payload.status, mode: payload.mode } : prev);
      apiClient.get(`/runs/${payload.runId}`).then(res => setActiveRun(res.data.run)).catch(() => {});
    });

    socket.on('step_started', (payload) => {
      addTerminalLog('info', `Step #${payload.stepOrder} started: "${payload.name}" -> Selector: ${payload.selector}`);
      setActiveRun(prev => {
        if (!prev) return prev;
        const steps = [...(prev.steps || [])];
        if (steps[payload.stepIndex]) {
          steps[payload.stepIndex].status = 'running';
        }
        return { ...prev, steps };
      });
    });

    socket.on('selector_failed', (payload) => {
      addTerminalLog('warn', `Selector Failure on Step #${payload.stepOrder}! Missing: ${payload.failedSelector}. Invoking AI Reasoning Engine...`);
      setActiveRun(prev => {
        if (!prev) return prev;
        const steps = [...(prev.steps || [])];
        if (steps[payload.stepIndex]) {
          steps[payload.stepIndex].status = 'healing';
        }
        return { ...prev, steps };
      });
    });

    socket.on('healing_in_progress', (payload) => {
      addTerminalLog('healing', `AI Engine analyzing DOM context for intent: "${payload.intent}"`);
    });

    socket.on('healed_successfully', (payload) => {
      addTerminalLog('success', `✔ Healed: [${payload.oldSelector}] -> [${payload.newSelector}] (${payload.confidence}% confidence via ${payload.strategyLayer})`);
      setActiveRun(prev => {
        if (!prev) return prev;
        const steps = [...(prev.steps || [])];
        if (steps[payload.stepIndex]) {
          steps[payload.stepIndex].status = 'healed';
          steps[payload.stepIndex].resolvedSelector = payload.newSelector;
          steps[payload.stepIndex].healingDetails = {
            wasHealed: true,
            confidence: payload.confidence,
            reasoning: payload.reasoning,
            classification: 'Harmless_UI_Change'
          };
        }
        return { ...prev, steps, healedCount: (prev.healedCount || 0) + 1 };
      });
    });

    socket.on('bug_detected', (payload) => {
      addTerminalLog('error', `🚨 GENUINE APPLICATION BUG DETECTED: ${payload.reasoning} (Test halted)`);
      setActiveRun(prev => {
        if (!prev) return prev;
        const steps = [...(prev.steps || [])];
        if (steps[payload.stepIndex]) {
          steps[payload.stepIndex].status = 'failed';
          steps[payload.stepIndex].error = payload.reasoning;
          steps[payload.stepIndex].healingDetails = {
            wasHealed: false,
            confidence: payload.confidence,
            reasoning: payload.reasoning,
            classification: 'Genuine_Bug'
          };
        }
        return { ...prev, steps, status: 'failed', triageClassification: 'Genuine_Bug_Halted' };
      });
    });

    socket.on('step_completed', (payload) => {
      addTerminalLog(payload.status === 'failed' ? 'error' : 'success', `Step #${payload.stepOrder} finished [${payload.status}] in ${payload.durationMs}ms`);
      setActiveRun(prev => {
        if (!prev) return prev;
        const steps = [...(prev.steps || [])];
        if (steps[payload.stepIndex]) {
          steps[payload.stepIndex].status = payload.status;
          steps[payload.stepIndex].durationMs = payload.durationMs;
          if (payload.resolvedSelector) {
            steps[payload.stepIndex].resolvedSelector = payload.resolvedSelector;
          }
          if (payload.healingDetails) {
            steps[payload.stepIndex].healingDetails = payload.healingDetails;
          }
          if (payload.error) {
            steps[payload.stepIndex].error = payload.error;
          }
        }
        return { ...prev, steps };
      });
    });

    socket.on('run_completed', async (payload) => {
      addTerminalLog('success', `🎉 E2E Test Run Completed! Status: ${payload.status.toUpperCase()} (${payload.durationMs}ms, Healed Steps: ${payload.healedCount})`);
      try {
        const runRes = await apiClient.get(`/runs/${payload.runId}`);
        if (runRes.data && runRes.data.run) {
          setActiveRun(runRes.data.run);
        }
      } catch (e) {}
      refreshAll();
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('run_status_changed');
      socket.off('step_started');
      socket.off('selector_failed');
      socket.off('healing_in_progress');
      socket.off('healed_successfully');
      socket.off('bug_detected');
      socket.off('step_completed');
      socket.off('run_completed');
    };
  }, []);

  const addTerminalLog = (type, message) => {
    const timestamp = new Date().toLocaleTimeString();
    setTerminalLogs(prev => [...prev.slice(-100), { timestamp, type, message }]);
  };

  const triggerRun = async (testId, mode = 'standard', headless = true, extraOptions = {}) => {
    try {
      addTerminalLog('info', `Triggering run on test [${testId || 'Default'}] in [${mode.toUpperCase()}] mode...`);
      const res = await apiClient.post('/runs/execute', {
        testId,
        mode,
        headless,
        ...extraOptions
      });
      const runId = res.data.runId;
      // Fetch initial run
      const runRes = await apiClient.get(`/runs/${runId}`);
      setActiveRun(runRes.data.run);
      return res.data;
    } catch (err) {
      addTerminalLog('error', `Failed to initiate test run: ${err.message}`);
      throw err;
    }
  };

  return (
    <TestContext.Provider value={{
      tests,
      runs,
      activeRun,
      setActiveRun,
      healingLogs,
      stats,
      systemHealth,
      socketConnected,
      terminalLogs,
      addTerminalLog,
      triggerRun,
      refreshAll,
      clearLogs: () => setTerminalLogs([])
    }}>
      {children}
    </TestContext.Provider>
  );
}

export const useTests = () => useContext(TestContext);
