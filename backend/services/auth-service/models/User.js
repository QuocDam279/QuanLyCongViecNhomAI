// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['member', 'leader'],
    default: 'member'
  },
  avatar: {
    type: String, // Đường dẫn ảnh: /uploads/avatars/abc.jpg
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);