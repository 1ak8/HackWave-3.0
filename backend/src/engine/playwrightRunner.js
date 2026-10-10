const { chromium } = require('playwright');
const { extractInteractiveDOM } = require('./domExtractor');
const { healBrokenStep } = require('./aiHealer');
const { emitRunTelemetry } = require('../config/socket');
const store = require('../models/store');
const logger = require('../utils/logger');

const runE2ETest = async (runId, testCase, options = {}) => {
  const mode = options.mode || 'standard';
  const isHeadless = options.headless !== undefined 
    ? options.headless 
    : (process.env.HEADLESS_BROWSER !== 'false');

  logger.info(`Starting E2E Run [${runId}] for "${testCase.title}" (Mode: ${mode}, Headless: ${isHeadless})`);

  let browser = null;
  const startTime = Date.now();
  let healedCount = 0;
  let passedCount = 0;
  let failedCount = 0;
  let triageClassification = 'Clean';

  // Construct target URL with test mode query
  let targetUrl = testCase.targetUrl || 'http://localhost:5173/demo-store';
  const urlSeparator = targetUrl.includes('?') ? '&' : '?';
  const fullTargetUrl = `${targetUrl}${urlSeparator}mode=${mode}&runId=${runId}`;

  // Initialize Run state in database
  const runSteps = (testCase.steps || []).map(s => ({
    order: s.order,
    name: s.name,
    intent: s.intent,
    action: s.action,
    originalSelector: s.selector,
    resolvedSelector: s.selector,
    status: 'pending',
    durationMs: 0,
    healingDetails: {
      wasHealed: false,
      confidence: 0,
      reasoning: '',
      classification: ''
    }
  }));

  await store.updateRun(runId, {
    status: 'running',
    mode,
    steps: runSteps,
    totalSteps: runSteps.length
  });

  emitRunTelemetry(runId, 'run_status_changed', {
    runId,
    status: 'running',
    mode,
    totalSteps: runSteps.length
  });

  try {
    browser = await chromium.launch({
      headless: isHeadless,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 }
    });
    const page = await context.newPage();

    // Navigate to target application
    logger.info(`Navigating browser to: ${fullTargetUrl}`);
    emitRunTelemetry(runId, 'run_log', {
      type: 'info',
      message: `Navigating browser to target endpoint: ${fullTargetUrl}`
    });

    try {
      await page.goto(fullTargetUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
      // Brief settling pause
      await page.waitForTimeout(600);
    } catch (navErr) {
      logger.warn(`Direct navigation failed or timed out (${navErr.message}).`);
    }

    // Step-by-Step Execution Loop
    for (let i = 0; i < runSteps.length; i++) {
      const step = runSteps[i];
      const stepStartTime = Date.now();
      step.status = 'running';

      logger.info(`Executing Step ${step.order}/${runSteps.length}: [${step.name}] -> Intent: "${step.intent}"`);

      emitRunTelemetry(runId, 'step_started', {
        runId,
        stepIndex: i,
        stepOrder: step.order,
        name: step.name,
        intent: step.intent,
        selector: step.originalSelector
      });

      let currentSelector = step.originalSelector;
      let executedSuccessfully = false;

      // Fast check if original selector is currently interactable (1200ms timeout)
      try {
        if (step.action === 'click') {
          await page.click(currentSelector, { timeout: 1400 });
          executedSuccessfully = true;
        } else if (step.action === 'fill') {
          await page.fill(currentSelector, step.value || '', { timeout: 1400 });
          executedSuccessfully = true;
        } else if (step.action === 'assert') {
          await page.waitForSelector(currentSelector, { timeout: 1400 });
          executedSuccessfully = true;
        }
      } catch (selectorErr) {
        logger.warn(`Step [${step.name}] failed on selector "${currentSelector}". Initiating Autonomous Self-Healing...`);

        // Selector failed! Emit event to trigger glowing yellow Intent Graph
        emitRunTelemetry(runId, 'selector_failed', {
          runId,
          stepIndex: i,
          stepOrder: step.order,
          failedSelector: currentSelector,
          intent: step.intent,
          error: selectorErr.message
        });

        // 🧠 ACTIVATE AI SELF-HEALING ENGINE
        emitRunTelemetry(runId, 'healing_in_progress', {
          runId,
          stepIndex: i,
          stepOrder: step.order,
          intent: step.intent
        });

        // Extract clean interactive DOM
        const domData = await extractInteractiveDOM(page);

        // Run Multi-strategy AI healing & Smart Triage
        const healDecision = await healBrokenStep({
          intent: step.intent,
          brokenSelector: currentSelector,
          domData,
          mode
        });

        if (healDecision.classification === 'Genuine_Bug') {
          // 🛡️ SMART TRIAGE: Real Bug Detected!
          triageClassification = 'Genuine_Bug_Halted';
          step.status = 'failed';
          step.durationMs = Date.now() - stepStartTime;
          step.healingDetails = {
            wasHealed: false,
            confidence: healDecision.confidence,
            reasoning: healDecision.reasoning,
            classification: 'Genuine_Bug'
          };
          step.error = healDecision.reasoning;
          failedCount++;

          await store.createHealingLog({
            runId,
            testId: testCase._id,
            stepOrder: step.order,
            stepName: step.name,
            userIntent: step.intent,
            brokenSelector: currentSelector,
            healedSelector: 'NONE (BLOCKED)',
            confidence: healDecision.confidence,
            strategyLayer: healDecision.strategyLayer,
            classification: 'Genuine_Bug',
            reasoning: healDecision.reasoning
          });

          emitRunTelemetry(runId, 'bug_detected', {
            runId,
            stepIndex: i,
            stepOrder: step.order,
            reasoning: healDecision.reasoning,
            confidence: healDecision.confidence
          });

          logger.error(`🚨 Genuine Bug Flagged: ${healDecision.reasoning}`);
          break; // Stop test execution on genuine regression
        }

        // HARMLESS UI SHIFT: Heal and continue!
        if (healDecision.isSafeToResume && healDecision.healedSelector) {
          const newSelector = healDecision.healedSelector;
          logger.healing(`Applying healed selector: "${newSelector}" (Confidence: ${healDecision.confidence}%)`);

          try {
            // Execute action with healed replacement element
            if (step.action === 'click') {
              await page.click(newSelector, { timeout: 3000 });
            } else if (step.action === 'fill') {
              await page.fill(newSelector, step.value || '', { timeout: 3000 });
            } else if (step.action === 'assert') {
              await page.waitForSelector(newSelector, { timeout: 3000 });
            }

            executedSuccessfully = true;
            healedCount++;
            triageClassification = 'Harmless_Healed';
            step.status = 'healed';
            step.resolvedSelector = newSelector;
            step.healingDetails = {
              wasHealed: true,
              confidence: healDecision.confidence,
              reasoning: healDecision.reasoning,
              classification: 'Harmless_UI_Change'
            };

            // Log healing event to database
            await store.createHealingLog({
              runId,
              testId: testCase._id,
              stepOrder: step.order,
              stepName: step.name,
              userIntent: step.intent,
              brokenSelector: currentSelector,
              healedSelector: newSelector,
              confidence: healDecision.confidence,
              strategyLayer: healDecision.strategyLayer,
              classification: 'Harmless_UI_Change',
              reasoning: healDecision.reasoning
            });

            emitRunTelemetry(runId, 'healed_successfully', {
              runId,
              stepIndex: i,
              stepOrder: step.order,
              oldSelector: currentSelector,
              newSelector,
              confidence: healDecision.confidence,
              strategyLayer: healDecision.strategyLayer,
              reasoning: healDecision.reasoning
            });
          } catch (retryErr) {
            step.status = 'failed';
            step.error = `Healed selector failed: ${retryErr.message}`;
            failedCount++;
            emitRunTelemetry(runId, 'step_failed', { runId, stepIndex: i, error: step.error });
            break;
          }
        }
      }

      if (executedSuccessfully && step.status !== 'healed') {
        step.status = 'passed';
        passedCount++;
      } else if (step.status === 'healed') {
        passedCount++;
      }

      step.durationMs = Date.now() - stepStartTime;

      emitRunTelemetry(runId, 'step_completed', {
        runId,
        stepIndex: i,
        stepOrder: step.order,
        status: step.status,
        durationMs: step.durationMs,
        resolvedSelector: step.resolvedSelector
      });

      // Brief human-friendly step transition
      await page.waitForTimeout(400);
    }

  } catch (globalErr) {
    logger.error(`Critical Run Failure: ${globalErr.message}`);
    failedCount++;
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }

    const totalDuration = Date.now() - startTime;
    const finalStatus = failedCount > 0 
      ? 'failed' 
      : (healedCount > 0 ? 'healed' : 'passed');

    // Update final run metrics in database
    await store.updateRun(runId, {
      status: finalStatus,
      durationMs: totalDuration,
      steps: runSteps,
      healedCount,
      passedSteps: passedCount,
      failedSteps: failedCount,
      triageClassification
    });

    emitRunTelemetry(runId, 'run_completed', {
      runId,
      status: finalStatus,
      durationMs: totalDuration,
      healedCount,
      passedSteps: passedCount,
      failedSteps: failedCount,
      triageClassification
    });

    logger.success(`E2E Run [${runId}] Completed: ${finalStatus.toUpperCase()} (${totalDuration}ms, Healed: ${healedCount})`);
  }
};

module.exports = { runE2ETest };
