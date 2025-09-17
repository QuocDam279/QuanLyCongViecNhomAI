// backend/gateway/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const gatewayRoutes = require('./routes/gatewayRoutes');

const app = express();

// 🛡️ Middleware cơ bản
app.use(cors({
  origin: 'http://localhost:5173', // Cho phép frontend Vite truy cập
  credentials: true
}));
app.use(express.json()); // Parse JSON body
app.use(morgan('dev')); // Log request ra console

// 🚪 Route chính
app.use('/api', gatewayRoutes);

// 🩺 Health check riêng cho Gateway
app.get('/health', (req, res) => {
  res.json({ status: 'Gateway OK', timestamp: new Date().toISOString() });
});

// ❌ Xử lý lỗi không tìm thấy route
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

// 🛠️ Xử lý lỗi toàn cục
app.use((err, req, res, next) => {
  console.error('🔥 Lỗi toàn cục:', err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// 🚀 Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 API Gateway đang chạy tại http://localhost:${PORT}`);
});