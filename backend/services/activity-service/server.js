//backend/services/activity-service/service.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/activities', require('./routes/activityRoutes'));

const PORT = process.env.PORT || 5004;
app.listen(PORT, () => console.log(`🚀 Activity Service running on port ${PORT}`));