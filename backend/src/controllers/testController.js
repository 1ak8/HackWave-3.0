const store = require('../models/store');
const logger = require('../utils/logger');

const testController = {
  // GET /api/tests
  async listTests(req, res) {
    try {
      const tests = await store.getTests();
      res.json({ tests });
    } catch (err) {
      logger.error('Failed to list tests', err.message);
      res.status(500).json({ error: err.message });
    }
  },

  // GET /api/tests/:id
  async getTest(req, res) {
    try {
      const test = await store.getTestById(req.params.id);
      if (!test) return res.status(404).json({ error: 'Test not found' });
      res.json({ test });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // POST /api/tests
  async createTest(req, res) {
    try {
      const { title, intent, targetUrl, steps, tags, description } = req.body;
      if (!title || !targetUrl) {
        return res.status(400).json({ error: 'Title and targetUrl are required' });
      }

      const created = await store.createTest({
        title,
        description: description || '',
        intent: intent || title,
        targetUrl,
        steps: steps || [],
        tags: tags || ['Custom Suite']
      });

      res.status(201).json({ test: created });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // PUT /api/tests/:id
  async updateTest(req, res) {
    try {
      const updated = await store.updateTest(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Test not found' });
      res.json({ test: updated });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // DELETE /api/tests/:id
  async deleteTest(req, res) {
    try {
      const success = await store.deleteTest(req.params.id);
      if (!success) return res.status(404).json({ error: 'Test not found' });
      res.json({ message: 'Test deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = testController;
