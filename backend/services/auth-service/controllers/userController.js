//backend/services/auth-service/controllers/userController.js
const User = require('../models/User');

// Cập nhật hồ sơ người dùng
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Không xác định người dùng' });
    }

    const updates = {};

    if (req.body.name) {
      updates.name = req.body.name.trim();
    }

    if (req.file) {
      updates.avatar = `/uploads/avatars/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });

    res.json({
      success: true,
      message: 'Cập nhật hồ sơ thành công',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar
      }
    });
  } catch (err) {
    console.error('❌ Lỗi cập nhật hồ sơ:', err.message);
    res.status(500).json({ success: false, error: 'Không thể cập nhật hồ sơ' });
  }
};

// Lấy hồ sơ người dùng
exports.getProfile = async (req, res) => {
  try {
    let userId = req.user.userId;

    // Cho phép gọi nội bộ với userId truyền qua params
    if (req.user.internal && req.params.userId) {
      userId = req.params.userId;
    }

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Không xác định người dùng' });
    }

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy người dùng' });
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || null
      }
    });
  } catch (err) {
    console.error('❌ Lỗi lấy hồ sơ:', err.message);
    res.status(500).json({ success: false, error: 'Lỗi máy chủ' });
  }
};