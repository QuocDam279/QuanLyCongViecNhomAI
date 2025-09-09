// backend/services/mcp-service/server.js
require('dotenv').config();
const express = require('express');
const app = express();
require('./config/db');

app.use(express.json());
app.use('/api/mcp', require('./routes/mcpRoutes'));

const PORT = process.env.PORT || 5007;
app.listen(PORT, () => console.log(`🚀 MCP Service chạy tại cổng ${PORT}`));