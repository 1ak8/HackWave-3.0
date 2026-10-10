const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');

router.get('/', testController.listTests);
router.get('/:id', testController.getTest);
router.post('/', testController.createTest);
router.put('/:id', testController.updateTest);
router.delete('/:id', testController.deleteTest);

module.exports = router;
