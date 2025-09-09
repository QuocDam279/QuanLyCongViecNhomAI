const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Không có header hoặc không đúng định dạng
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Không có token hoặc định dạng không hợp lệ' });
    }

    const token = authHeader.split(' ')[1];

    // Giải mã token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Kiểm tra token có chứa userId không
    if (!decoded.userId) {
      return res.status(401).json({ error: 'Token không chứa thông tin người dùng' });
    }

    // Gán thông tin user vào request
    req.user = {
      userId: decoded.userId,
      role: decoded.role || null
    };

    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    return res.status(401).json({ error: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};