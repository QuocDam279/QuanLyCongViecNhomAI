// backend/services/memory-service/models/Memory.js
const mongoose = require('mongoose');

const memorySchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, required: true },
  groupId: { type: mongoose.Types.ObjectId, required: false },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  source: {
    type: String,
    enum: ['document', 'activity', 'ai', 'mcp'],
    required: true
},
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Memory', memorySchema);