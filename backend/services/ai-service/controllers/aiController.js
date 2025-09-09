// backend/services/ai-service/controllers/aiController.js
const contextService = require('../services/contextService');
const llmService = require('../services/llmService');
const memoryService = require('../services/memoryService');
const mcpService = require('../services/mcpService');
const QueryLog = require('../models/QueryLog');

exports.handleQuery = async (req, res) => {
  try {
    const { query, groupId } = req.body;
    const userId = req.user.userId;

    const context = await contextService.getContext(userId, groupId);
    const mcpData = await mcpService.getAdditionalData(groupId);
    const fullContext = { ...context, mcp: mcpData };

    const answer = await llmService.askLLM(query, fullContext);

    await memoryService.saveInteraction(userId, groupId, query, answer);
    await QueryLog.create({ userId, groupId, query, context: fullContext, answer });

    res.json({ answer });
  } catch (err) {
    console.error('❌ Lỗi AI Service:', err.message);
    res.status(500).json({ error: 'Không thể xử lý truy vấn' });
  }
};