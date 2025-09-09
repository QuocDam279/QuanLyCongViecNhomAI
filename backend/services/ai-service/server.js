//backend/services/ai-service/server.js
require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());
app.use('/api/ai', require('./routes/aiRoutes'));

const PORT = process.env.PORT || 5006;
app.listen(PORT, () => console.log(`🚀 AI Service chạy tại cổng ${PORT}`));