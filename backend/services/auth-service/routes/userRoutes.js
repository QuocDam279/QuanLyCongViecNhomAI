// backend/services/auth-service/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Cấu hình lưu ảnh avatar
const storage = multer.diskStorage({
  destination: './uploads/avatars/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.user.userId}-${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

// Route cập nhật tên và avatar
router.patch('/profile', authMiddleware, upload.single('avatar'), userController.updateProfile);

// Route lấy thông tin người dùng
router.get('/profile', authMiddleware, userController.getProfile);

// Route lấy thông tin người dùng theo userId (dùng cho Group Service)
router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    const user = await require('../models/User').findById(req.params.userId, 'name email');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;