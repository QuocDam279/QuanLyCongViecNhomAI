// backend/services/mcp-service/models/TaskStatus.js
const mongoose = require('mongoose');

const taskStatusSchema = new mongoose.Schema({
  groupId: { type: mongoose.Types.ObjectId, required: true },
  userId: { type: mongoose.Types.ObjectId, required: true },
  task: { type: String, required: true },
  status: { type: String, enum: ['done', 'pending'], default: 'pending' },
  deadline: { type: Date }
});

module.exports = mongoose.model('TaskStatus', taskStatusSchema);