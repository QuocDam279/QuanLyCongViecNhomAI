//backend/services/notification-service/server.js
require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());
app.use('/api/notify', require('./routes/notifyRoutes'));

const PORT = process.env.PORT || 5008;
app.listen(PORT, () => console.log(`📨 Notification Service chạy tại cổng ${PORT}`));