const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  source: { type: String, enum: ['upload', 'google_drive', 'onedrive', 'internal'], default: 'upload' },
  link: String,
  filePath: String, // đường dẫn file local
  extractedContent: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);