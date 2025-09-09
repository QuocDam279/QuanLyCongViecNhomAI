//backend/services/activity-service/models/Activity.js
const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  type: { type: String, required: true }, // upload, edit, complete_task, meeting, deadline
  description: String,
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' }, // optional
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Activity', activitySchema);