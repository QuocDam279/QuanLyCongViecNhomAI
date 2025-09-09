// models/GroupMember.js
const mongoose = require('mongoose');

const groupMemberSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['leader', 'member'], default: 'member' }
}, { timestamps: true });

module.exports = mongoose.model('GroupMember', groupMemberSchema);