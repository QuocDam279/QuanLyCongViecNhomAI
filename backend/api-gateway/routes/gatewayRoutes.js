// backend/api-gateway/routes/gatewayRoutes.js
const express = require('express');
const router = express.Router();
const proxyController = require('../controllers/proxyController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = multer(); // dùng memoryStorage để nhận ảnh từ Postman

// 🔐 Auth Service – xác thực người dùng (không cần authMiddleware)
router.use('/auth/:path?', (req, res) => {
  req.params.service = 'auth_service';
  proxyController.forwardToService(req, res);
});

// 👤 User Service – hồ sơ người dùng (có authMiddleware)
router.patch('/user/:path?', authMiddleware, upload.single('avatar'), (req, res) => {
  req.params.service = 'user_service';
  proxyController.forwardToService(req, res);
});

router.get('/user/:path?', authMiddleware, (req, res) => {
  req.params.service = 'user_service';
  proxyController.forwardToService(req, res);
});

// 👥 Group Service – quản lý nhóm
router.use('/group/:path?', authMiddleware, (req, res) => {
  req.params.service = 'group_service';
  proxyController.forwardToService(req, res);
});

// 📄 Document Service – truy xuất tài liệu
router.use('/document/:path?', authMiddleware, upload.array('file', 5), (req, res) => {
  req.params.service = 'document_service';
  proxyController.forwardToService(req, res);
});

// 📊 Activity Service – theo dõi hoạt động nhóm, cá nhân nhóm
router.use('/activities/:path?', authMiddleware, (req, res) => {
  req.params.service = 'activities_service';
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

// 📬 Notification Service – gửi email nhắc việc
router.use('/notify/:path?', (req, res) => {
  req.params.service = 'notify_service';
  proxyController.forwardToService(req, res);
});


module.exports = router;