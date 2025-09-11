//backend/services/document-service/models/Document.js
const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },

  source: {
    type: String,
    enum: ['upload', 'external', 'google_drive', 'onedrive', 'internal'],
    default: 'upload',
    required: true
  },

  link: {
    type: String,
    validate: {
      validator: function (v) {
        return this.source !== 'upload' ? /^https?:\/\/.+/.test(v) : true;
      },
      message: 'Link không hợp lệ'
    }
  },

  filePath: {
    type: String,
    required: function () {
      return this.source === 'upload';
    }
  },

  extractedContent: {
    type: String,
    default: ''
  },

  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Document', documentSchema);