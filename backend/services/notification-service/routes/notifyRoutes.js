//backend/services/notification-service/routes/notifyRoutes.js
const express = require('express');
const router = express.Router();
const notifyController = require('../controllers/notifyController');

router.post('/reminder', notifyController.sendReminder);

module.exports = router;