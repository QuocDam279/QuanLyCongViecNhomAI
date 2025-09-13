// backend/services/mcp-service/routes/mcpRoutes.js
// backend/services/mcp-service/routes/mcpRoutes.js
const express = require('express');
const router = express.Router();
const mcpController = require('../controllers/mcpController');
const authMiddleware = require('../middleware/authMiddleware');

// 📊 Lấy danh sách nhiệm vụ theo nhóm
router.get('/group/:groupId', authMiddleware, mcpController.getGroupStatus);

// 📝 Tạo nhiệm vụ mới
router.post('/task', authMiddleware, mcpController.createTask);

// 🔄 Cập nhật trạng thái nhiệm vụ
router.patch('/task/:taskId/status', authMiddleware, mcpController.updateTaskStatus);

// 💬 Thêm bình luận vào nhiệm vụ
router.post('/task/:taskId/comment', authMiddleware, mcpController.addComment);

// 📋 Lấy danh sách nhiệm vụ của một user
router.get('/user/:userId/tasks', authMiddleware, mcpController.getUserTasks);

// ❌ Xóa nhiệm vụ
router.delete('/task/:taskId', authMiddleware, mcpController.deleteTask);

// 🔍 Lấy chi tiết nhiệm vụ
router.get('/task/:taskId', authMiddleware, mcpController.getTaskDetail);

module.exports = router;