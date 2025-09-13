// backend/services/memory-service/server.js
require('dotenv').config();
const express = require('express');
const app = express();

// Gọi hàm kết nối DB
const connectDB = require('./config/db');
connectDB(); // ← phải gọi hàm này

app.use(express.json());
app.use('/api/memory', require('./routes/memoryRoutes'));

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`🚀 Memory Service chạy tại cổng ${PORT}`));