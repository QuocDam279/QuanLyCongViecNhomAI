// backend/services/ai-service/models/QueryLog.js
const mongoose = require('mongoose');

const queryLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, required: true },
  groupId: { type: mongoose.Types.ObjectId, required: false },
  query: { type: String, required: true },
  context: { type: Object },
  answer: { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QueryLog', queryLogSchema);