// backend/services/auth-service/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// 📁 Cho phép truy cập ảnh avatar từ frontend
app.use('/uploads', express.static('uploads'));

// 🔐 Route xác thực
app.use('/api/auth', require('./routes/authRoutes'));

// 👤 Route cập nhật hồ sơ người dùng
app.use('/api/user', require('./routes/userRoutes')); // ← thêm dòng này

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Auth Service running on port ${PORT}`));