const express = require('express');
const router = express.Router();
const runController = require('../controllers/runController');

router.post('/execute', runController.triggerRun);
router.get('/', runController.listRuns);
router.get('/:id', runController.getRun);

module.exports = router;
