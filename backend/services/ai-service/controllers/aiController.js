// backend/services/ai-service/controllers/aiController.js
const contextService = require('../services/contextService');
const llmService = require('../services/llmService');
const memoryService = require('../services/memoryService');
const QueryLog = require('../models/QueryLog');

exports.handleQuery = async (req, res) => {
  try {
    const { query, groupId } = req.body;
    const userId = req.user.userId;

    // 1. Lấy ngữ cảnh từ các service nội bộ
    const context = await contextService.getContext(userId, groupId);

    // 2. Gửi truy vấn đến Claude qua OpenRouter
    const answer = await llmService.askLLM(query, context);

    // 3. Lưu lịch sử vào Memory Service
    await memoryService.saveInteraction(userId, groupId, query, answer);

    // 4. Ghi log vào MongoDB
    await QueryLog.create({
      userId,
      groupId,
      query,
      context,
      answer
    });

    // 5. Trả kết quả về client
    res.json({ answer });
  } catch (err) {
    console.error('❌ Lỗi AI Service:', err.message, err.stack || '');
    res.status(500).json({ error: 'Không thể xử lý truy vấn' });
  }
};