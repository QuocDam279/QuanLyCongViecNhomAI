// backend/services/mcp-service/models/TaskStatus.js
const mongoose = require('mongoose');

const taskStatusSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true, // chỉ lưu ObjectId, không ref sang Group
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true, // chỉ lưu ObjectId, thông tin user lấy từ auth-service
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true, // chỉ lưu ObjectId, thông tin user lấy từ auth-service
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
    type: Date,
    required: true
  },

  completedAt: {
    type: Date
  },

  comments: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId }, // thông tin user lấy từ auth-service
      message: String,
      createdAt: { type: Date, default: Date.now }
    }
  ],

  tags: [String],
  
  attachments: [String]

}, { timestamps: true });

module.exports = mongoose.model('TaskStatus', taskStatusSchema);
