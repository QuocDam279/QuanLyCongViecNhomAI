// backend/services/ai-service/service/memoryService.js
const axios = require('axios');

exports.saveInteraction = async (userId, groupId, question, answer) => {
  try {
    await axios.post('http://memory-service:5005/api/memory', {
      userId,
      groupId,
      question,
      answer,
      source: 'ai'
    });
  } catch (err) {
    console.error('❌ Lỗi lưu vào Memory Service:', err.message);
  }
};