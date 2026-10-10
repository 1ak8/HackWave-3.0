const store = require('../models/store');
const { runE2ETest } = require('../engine/playwrightRunner');
const logger = require('../utils/logger');

const runController = {
  // POST /api/runs/execute
  async triggerRun(req, res) {
    try {
      const { testId, mode = 'standard', headless } = req.body;

      let targetTest = null;
      if (testId) {
        targetTest = await store.getTestById(testId);
      }
      
      // If no testId or not found, fall back to default suite
      if (!targetTest) {
        const allTests = await store.getTests();
        targetTest = allTests[0];
      }

      if (!targetTest) {
        return res.status(404).json({ error: 'No test suite available to execute' });
      }

      // Create initial run record
      const initialRun = await store.createRun({
        testId: targetTest._id,
        testTitle: targetTest.title,
        status: 'pending',
        mode,
        durationMs: 0,
        healedCount: 0,
        totalSteps: targetTest.steps ? targetTest.steps.length : 0,
        passedSteps: 0,
        failedSteps: 0,
        steps: []
      });

      // Fire and forget Playwright execution in background so client gets instant runId
      runE2ETest(initialRun._id, targetTest, {
        mode,
        headless: headless !== undefined ? headless : (process.env.HEADLESS_BROWSER !== 'false')
      }).catch(err => {
        logger.error(`Error in run execution: ${err.message}`);
      });

      res.status(202).json({
        message: 'Test run initiated successfully',
        runId: initialRun._id,
        testTitle: targetTest.title,
        mode
      });
    } catch (err) {
      logger.error('Failed to trigger run', err.message);
      res.status(500).json({ error: err.message });
    }
  },

  // GET /api/runs
  async listRuns(req, res) {
    try {
      const runs = await store.getRuns(req.query.limit ? parseInt(req.query.limit) : 25);
      res.json({ runs });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // GET /api/runs/:id
  async getRun(req, res) {
    try {
      const run = await store.getRunById(req.params.id);
      if (!run) return res.status(404).json({ error: 'Run not found' });
      res.json({ run });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = runController;
