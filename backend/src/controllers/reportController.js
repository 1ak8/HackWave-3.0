const store = require('../models/store');
const logger = require('../utils/logger');

const reportController = {
  // GET /api/reports/stats
  async getMetrics(req, res) {
    try {
      const stats = await store.getStats();
      res.json({ stats });
    } catch (err) {
      logger.error('Failed to get stats', err.message);
      res.status(500).json({ error: err.message });
    }
  },

  // GET /api/reports/healing-logs
  async listHealingLogs(req, res) {
    try {
      const logs = await store.getHealingLogs(req.query.limit ? parseInt(req.query.limit) : 50);
      res.json({ logs, healingLogs: logs });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // POST /api/reports/healing-logs (Records live healing actions from tests)
  async createHealingLog(req, res) {
    try {
      const log = await store.createHealingLog(req.body);
      res.status(201).json({ log, healingLog: log });
    } catch (err) {
      logger.error('Failed to create healing log', err.message);
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = reportController;
