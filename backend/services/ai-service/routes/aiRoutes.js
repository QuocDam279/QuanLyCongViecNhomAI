// backend/services/ai-service/routes/aiRoutes.js
const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/query', authMiddleware, aiController.handleQuery);

module.exports = router;