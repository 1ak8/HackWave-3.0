const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.get('/stats', reportController.getMetrics);
router.get('/healing-logs', reportController.listHealingLogs);
router.post('/healing-logs', reportController.createHealingLog);

module.exports = router;
