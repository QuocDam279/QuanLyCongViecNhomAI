const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Serve file public
app.use('/files', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/documents', require('./routes/documentRoutes'));

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`🚀 Document Service running on port ${PORT}`));