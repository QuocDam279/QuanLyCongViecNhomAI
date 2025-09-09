// backend/api-gateway/routes/gatewayRoutes.js
const express = require('express');
const router = express.Router();
const proxyController = require('../controllers/proxyController');
const authMiddleware = require('../middleware/authMiddleware');

// 🔐 Auth Service – xác thực người dùng
router.use('/auth/:path?', (req, res) => {
  req.params.service = 'auth_service';
  proxyController.forwardToService(req, res);
});
// Không cần authMiddleware ở đây vì đây là nơi cấp token

// 👥 Group Service – quản lý nhóm
router.use('/group/:path?', authMiddleware, (req, res) => {
  req.params.service = 'group_service';
  proxyController.forwardToService(req, res);
});

// 📄 Document Service – truy xuất tài liệu
router.use('/documents/:path?', authMiddleware, (req, res) => {
  req.params.service = 'document_service';
  proxyController.forwardToService(req, res);
});

// 📊 Activity Service – theo dõi hoạt động nhóm
router.use('/activities/:path?', authMiddleware, (req, res) => {
  req.params.service = 'activity_service';
  proxyController.forwardToService(req, res);
});

// 🧠 Memory Service – lưu lịch sử hội thoại
router.use('/memory/:path?', authMiddleware, (req, res) => {
  req.params.service = 'memory_service';
  proxyController.forwardToService(req, res);
});

// 🤖 AI Service – xử lý truy vấn ngôn ngữ
router.use('/ai/:path?', authMiddleware, (req, res) => {
  req.params.service = 'ai_service';
  proxyController.forwardToService(req, res);
});

// 📈 MCP Service – tổng hợp tiến độ nhóm
router.use('/mcp/:path?', authMiddleware, (req, res) => {
  req.params.service = 'mcp_service';
  proxyController.forwardToService(req, res);
});

module.exports = router;