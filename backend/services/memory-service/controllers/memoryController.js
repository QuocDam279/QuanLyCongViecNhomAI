// backend/services/memory-service/controllers/memoryController.js
const Memory = require('../models/Memory');

exports.saveMemory = async (req, res) => {
  try {
    const { userId, groupId, question, answer, source } = req.body;
    const memory = await Memory.create({ userId, groupId, question, answer, source });
    res.status(201).json({ message: 'Đã lưu vào bộ nhớ', memory });
  } catch (err) {
    console.error('❌ Lỗi lưu memory:', err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getUserMemory = async (req, res) => {
  try {
    const { userId } = req.params;
    const memories = await Memory.find({ userId }).sort({ timestamp: -1 });
    res.json(memories);
  } catch (err) {
    console.error('❌ Lỗi lấy memory người dùng:', err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getGroupMemory = async (req, res) => {
  try {
    const { groupId } = req.params;
    const memories = await Memory.find({ groupId }).sort({ timestamp: -1 });
    res.json(memories);
  } catch (err) {
    console.error('❌ Lỗi lấy memory nhóm:', err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.searchMemory = async (req, res) => {
  try {
    const { userId, keyword } = req.query;
    const memories = await Memory.find({
      userId,
      $or: [
        { question: { $regex: keyword, $options: 'i' } },
        { answer: { $regex: keyword, $options: 'i' } }
      ]
    });
    res.json(memories);
  } catch (err) {
    console.error('❌ Lỗi tìm kiếm memory:', err.message);
    res.status(500).json({ error: err.message });
  }
};