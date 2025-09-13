// backend/services/mcp-service/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Kiểm tra header tồn tại và đúng định dạng
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Không có token hoặc định dạng không hợp lệ' });
  }

  const token = authHeader.split(' ')[1];

  // ✅ Nếu là API key nội bộ
  if (token === process.env.INTERNAL_API_KEY) {
    req.user = { internal: true }; // Gắn cờ nội bộ nếu cần
    return next();
  }

  // ✅ Nếu là JWT từ người dùng
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.userId) {
      return res.status(401).json({ error: 'Token không chứa thông tin người dùng' });
    }

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role || null
    };

    next();
  } catch (err) {
    console.error('❌ Token không hợp lệ:', err.message);
    res.status(403).json({ error: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};