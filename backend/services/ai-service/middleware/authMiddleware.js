// backend/services/ai-service/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Thiếu thông tin xác thực' });

  const token = authHeader.split(' ')[1];

  // Nếu là API nội bộ
  if (token === process.env.INTERNAL_API_KEY) {
    req.user = { internal: true };
    return next();
  }

  // Nếu là JWT
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };
    next();
  } catch (err) {
    console.error('❌ Token không hợp lệ:', err.message);
    res.status(403).json({ error: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};