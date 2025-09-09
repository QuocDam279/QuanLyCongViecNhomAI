// backend/services/memory-service/routes/memoryRoutes.js
const express = require('express');
const router = express.Router();
const memoryController = require('../controllers/memoryController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, memoryController.saveMemory);
router.get('/user/:userId', authMiddleware, memoryController.getUserMemory);
router.get('/group/:groupId', authMiddleware, memoryController.getGroupMemory);
router.get('/search', authMiddleware, memoryController.searchMemory);

module.exports = router;