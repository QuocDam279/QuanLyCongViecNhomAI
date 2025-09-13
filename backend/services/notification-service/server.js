//backend/services/notification-service/server.js
require('dotenv').config();
const express = require('express');
const cron = require('node-cron');
const axios = require('axios');

const app = express();
app.use(express.json());

// 📬 Route gửi email nhắc việc
app.use('/api/notify', require('./routes/notifyRoutes'));

const PORT = process.env.PORT || 5008;

// 🕗 Cron job: chạy mỗi ngày lúc 8h sáng
cron.schedule('0 8 * * *', async () => {
  console.log('🔔 Cron job đang gọi MCP Service để lấy deadline...');

  try {
    const { data: usersToRemind } = await axios.get('http://mcp-service:5007/api/mcp/upcoming-deadlines');

    for (const user of usersToRemind) {
      await axios.post(`http://localhost:${PORT}/api/notify/reminder`, {
        email: user.email,
        name: user.name,
        task: user.task,
        deadline: user.deadline
      });
      console.log(`✅ Đã gửi email cho ${user.email}`);
    }
  } catch (err) {
    console.error('❌ Lỗi khi gửi email tự động:', err.message);
  }
});

app.listen(PORT, () => {
  console.log(`📨 Notification Service chạy tại cổng ${PORT}`);
});