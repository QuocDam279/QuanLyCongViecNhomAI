//backend/services/activity-service/routes/activityRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  logActivity,
  getGroupTimeline,
  getUserActivity
} = require('../controllers/activityController');

// 📌 Ghi nhận một hoạt động nhóm
router.post('/', auth, logActivity);

// 📌 Lấy timeline hoạt động của nhóm (có phân trang)
router.get('/group/:groupId', auth, getGroupTimeline);

// 📌 Lấy hoạt động của một người dùng (chỉ leader cùng nhóm mới được xem)
router.get('/user/:userId', auth, getUserActivity);

module.exports = router;