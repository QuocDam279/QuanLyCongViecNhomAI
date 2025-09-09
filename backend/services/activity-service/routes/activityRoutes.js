//backend/services/activity-service/routes/activityRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  logActivity,
  getGroupTimeline
} = require('../controllers/activityController');

router.post('/', auth, logActivity);
router.get('/group/:groupId', auth, getGroupTimeline);

module.exports = router;