// backend/services/mcp-service/models/TaskStatus.js
const mongoose = require('mongoose');

const taskStatusSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  task: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    default: ''
  },

  status: {
    type: String,
    enum: ['pending', 'in_progress', 'reviewing', 'done'],
    default: 'pending'
  },

  deadline: {
    type: Date
  },

  completedAt: {
    type: Date
  },

  comments: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      message: String,
      createdAt: { type: Date, default: Date.now }
    }
  ],

  tags: [String],
  attachments: [String]

}, { timestamps: true });

module.exports = mongoose.model('TaskStatus', taskStatusSchema);