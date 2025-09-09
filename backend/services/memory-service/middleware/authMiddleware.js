// backend/services/memory-service/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Thiếu token xác thực' });

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
    res.status(403).json({ error: 'Token không hợp lệ' });
  }
};