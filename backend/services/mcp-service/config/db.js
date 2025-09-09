// backend/services/mcp-service/config/db.js
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Kết nối MongoDB MCP thành công'))
  .catch(err => console.error('❌ Lỗi kết nối MongoDB MCP:', err.message));