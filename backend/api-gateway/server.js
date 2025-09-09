// backend/gateway/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// 🛡️ Middleware cơ bản
app.use(cors()); // Cho phép frontend gọi từ domain khác
app.use(express.json()); // Parse JSON body
app.use(morgan('dev')); // Log request ra console

// 🚪 Route chính
app.use('/api', require('./routes/gatewayRoutes'));

// 🩺 Health check riêng cho Gateway
app.get('/health', (req, res) => {
  res.json({ status: 'Gateway OK', timestamp: new Date().toISOString() });
});

// 🚀 Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 API Gateway chạy tại cổng ${PORT}`));