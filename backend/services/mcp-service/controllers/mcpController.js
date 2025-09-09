// backend/services/mcp-service/controllers/mcpController.js
const TaskStatus = require('../models/TaskStatus');

exports.getGroupStatus = async (req, res) => {
  try {
    const { groupId } = req.params;
    const tasks = await TaskStatus.find({ groupId });

    const summary = tasks.reduce((acc, task) => {
      const userId = task.userId.toString();
      if (!acc[userId]) acc[userId] = [];
      acc[userId].push({
        task: task.task,
        status: task.status,
        deadline: task.deadline
      });
      return acc;
    }, {});

    res.json({ groupId, members: summary });
  } catch (err) {
    console.error('❌ Lỗi MCP:', err.message);
    res.status(500).json({ error: 'Không thể lấy dữ liệu nhóm' });
  }
};