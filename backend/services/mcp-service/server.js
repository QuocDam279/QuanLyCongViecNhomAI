// backend/services/mcp-service/server.js
require('dotenv').config();
const express = require('express');
const app = express();
require('./config/db');

app.use(express.json());

// Gợi ý thêm log request để debug
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  next();
});

app.use('/api/mcp', require('./routes/mcpRoutes'));

const PORT = process.env.PORT || 5007;
app.listen(PORT, () => console.log(`🚀 MCP Service chạy tại cổng ${PORT}`));