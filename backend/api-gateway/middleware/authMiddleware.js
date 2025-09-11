// backend/api-gateway/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Kiểm tra header Authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Thiếu hoặc sai định dạng token' });
    }

    const token = authHeader.split(' ')[1];

    // Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Gắn thông tin người dùng vào request
    req.user = {
      userId: decoded.userId,
      role: decoded.role
    };

    next();
  } catch (err) {
    console.error('❌ Token không hợp lệ:', err.message);
    res.status(403).json({ success: false, error: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};