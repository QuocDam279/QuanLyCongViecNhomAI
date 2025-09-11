// backend/services/mcp-service/routes/mcpRoutes.js
const express = require('express');
const router = express.Router();
const mcpController = require('../controllers/mcpController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/group/:groupId', authMiddleware, mcpController.getGroupStatus);

// Gợi ý thêm endpoint tạo nhiệm vụ
router.post('/task', authMiddleware, mcpController.createTask);

module.exports = router;