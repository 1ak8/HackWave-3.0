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
      setActiveRun(prev => {
        if (!prev) {
          return {
            _id: payload.runId,
            status: payload.status,
            mode: payload.mode || 'standard',
            steps: [],
            healedCount: 0
          };
        }
        return {
          ...prev,
          _id: payload.runId,
          status: payload.status,
          mode: payload.mode || prev.mode || 'standard'
        };
      });
    });

    socket.on('step_started', (payload) => {
      addTerminalLog('info', `Step #${payload.stepOrder} started: "${payload.name}" -> Selector: ${payload.selector}`);
      setActiveRun(prev => {
        const currentSteps = prev?.steps ? [...prev.steps] : [];
        const idx = currentSteps.findIndex(s => s.order === payload.stepOrder);
        if (idx !== -1) {
          currentSteps[idx] = { ...currentSteps[idx], status: 'running' };
        } else if (payload.stepIndex !== undefined && currentSteps[payload.stepIndex]) {
          currentSteps[payload.stepIndex] = { ...currentSteps[payload.stepIndex], status: 'running' };
        }
        return prev ? { ...prev, steps: currentSteps } : { _id: payload.runId, status: 'running', steps: currentSteps };
      });
    });

    socket.on('selector_failed', (payload) => {
      addTerminalLog('warn', `Selector Failure on Step #${payload.stepOrder}! Missing: ${payload.failedSelector}. Invoking AI Reasoning Engine...`);
      setActiveRun(prev => {
        const currentSteps = prev?.steps ? [...prev.steps] : [];
        const idx = currentSteps.findIndex(s => s.order === payload.stepOrder);
        if (idx !== -1) {
          currentSteps[idx] = { ...currentSteps[idx], status: 'healing' };
        } else if (payload.stepIndex !== undefined && currentSteps[payload.stepIndex]) {
          currentSteps[payload.stepIndex] = { ...currentSteps[payload.stepIndex], status: 'healing' };
        }
        return prev ? { ...prev, steps: currentSteps } : { _id: payload.runId, status: 'running', steps: currentSteps };
      });
    });

    socket.on('healing_in_progress', (payload) => {
      addTerminalLog('healing', `AI Engine analyzing DOM context for intent: "${payload.intent}"`);
    });

    socket.on('healed_successfully', (payload) => {
      addTerminalLog('success', `✔ Healed: [${payload.oldSelector}] -> [${payload.newSelector}] (${payload.confidence}% confidence via ${payload.strategyLayer})`);
      setActiveRun(prev => {
        const currentSteps = prev?.steps ? [...prev.steps] : [];
        const idx = currentSteps.findIndex(s => s.order === payload.stepOrder);
        const targetIdx = idx !== -1 ? idx : payload.stepIndex;
        if (targetIdx !== undefined && currentSteps[targetIdx]) {
          currentSteps[targetIdx] = {
            ...currentSteps[targetIdx],
            status: 'healed',
            resolvedSelector: payload.newSelector,
            healingDetails: {
              wasHealed: true,
              confidence: payload.confidence,
              reasoning: payload.reasoning,
              classification: 'Harmless_UI_Change'
            }
          };
        }
        const healedCount = currentSteps.filter(s => s.status === 'healed' && s.resolvedSelector && s.resolvedSelector !== s.originalSelector).length;
        return prev ? { ...prev, steps: currentSteps, healedCount } : { _id: payload.runId, status: 'running', steps: currentSteps, healedCount };
      });
    });

    socket.on('bug_detected', (payload) => {
      addTerminalLog('error', `🚨 GENUINE APPLICATION BUG DETECTED: ${payload.reasoning} (Test halted)`);
      setActiveRun(prev => {
        const currentSteps = prev?.steps ? [...prev.steps] : [];
        const idx = currentSteps.findIndex(s => s.order === payload.stepOrder);
        const targetIdx = idx !== -1 ? idx : payload.stepIndex;
        if (targetIdx !== undefined && currentSteps[targetIdx]) {
          currentSteps[targetIdx] = {
            ...currentSteps[targetIdx],
            status: 'failed',
            error: payload.reasoning,
            healingDetails: {
              wasHealed: false,
              confidence: payload.confidence,
              reasoning: payload.reasoning,
              classification: 'Genuine_Bug'
            }
          };
        }
        return prev
          ? { ...prev, steps: currentSteps, status: 'failed', triageClassification: 'Genuine_Bug_Halted' }
          : { _id: payload.runId, status: 'failed', triageClassification: 'Genuine_Bug_Halted', steps: currentSteps };
      });
    });

    socket.on('step_completed', (payload) => {
      addTerminalLog(payload.status === 'failed' ? 'error' : 'success', `Step #${payload.stepOrder} finished [${payload.status}] in ${payload.durationMs}ms`);
      setActiveRun(prev => {
        const currentSteps = prev?.steps ? [...prev.steps] : [];
        const idx = currentSteps.findIndex(s => s.order === payload.stepOrder);
        const targetIdx = idx !== -1 ? idx : payload.stepIndex;
        if (targetIdx !== undefined && currentSteps[targetIdx]) {
          currentSteps[targetIdx] = {
            ...currentSteps[targetIdx],
            status: payload.status,
            durationMs: payload.durationMs,
            resolvedSelector: payload.resolvedSelector || currentSteps[targetIdx].resolvedSelector,
            healingDetails: payload.healingDetails || currentSteps[targetIdx].healingDetails,
            error: payload.error || currentSteps[targetIdx].error
          };
        }
        const healedCount = currentSteps.filter(s => s.status === 'healed' && s.resolvedSelector && s.resolvedSelector !== s.originalSelector).length;
        return prev ? { ...prev, steps: currentSteps, healedCount } : { _id: payload.runId, status: 'running', steps: currentSteps, healedCount };
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
      const initialRun = res.data.run;

      if (initialRun) {
        setActiveRun(prev => {
          if (prev && prev.steps && prev.steps.length > 0) {
            const mergedSteps = initialRun.steps.map(remoteStep => {
              const local = prev.steps.find(s => s.order === remoteStep.order);
              // Preserve ANY status that has progressed from pending (running, healing, healed, passed, failed)!
              if (local && local.status && local.status !== 'pending') {
                return local;
              }
              return remoteStep;
            });
            const healedCount = mergedSteps.filter(s => s.status === 'healed' && s.resolvedSelector && s.resolvedSelector !== s.originalSelector).length;
            return { ...initialRun, steps: mergedSteps, healedCount: Math.max(prev.healedCount || 0, healedCount) };
          }
          return initialRun;
        });
      }
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
