//backend/services/auth-service/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 📌 Đăng ký tài khoản
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const role = req.body.role || 'member';

    // Kiểm tra đầu vào
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email đã được sử dụng.' });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role
    });

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công.',
      userId: user._id
    });
  } catch (err) {
    console.error('❌ Lỗi đăng ký:', err);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ. Vui lòng thử lại sau.' });
  }
};

// 🔐 Đăng nhập
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin đăng nhập.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Tìm người dùng theo email
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Email không tồn tại.' });
    }

    // So sánh mật khẩu
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ success: false, message: 'Sai mật khẩu.' });
    }

    // Tạo JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      success: true,
      message: 'Đăng nhập thành công.',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || null
      }
    });
  } catch (err) {
    console.error('❌ Lỗi đăng nhập:', err);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ. Vui lòng thử lại sau.' });
  }
};