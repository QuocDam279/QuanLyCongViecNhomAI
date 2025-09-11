// backend/services/mcp-service/controllers/mcpController.js
const mongoose = require('mongoose');
const TaskStatus = require('../models/TaskStatus');

exports.getGroupStatus = async (req, res) => {
  try {
    const { groupId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ error: 'groupId không hợp lệ' });
    }

    const tasks = await TaskStatus.find({ groupId }).populate('userId', 'name email');

    const summary = tasks.reduce((acc, task) => {
      const userId = task.userId._id.toString();
      if (!acc[userId]) {
        acc[userId] = {
          user: {
            _id: task.userId._id,
            name: task.userId.name,
            email: task.userId.email
          },
          tasks: []
        };
      }

      acc[userId].tasks.push({
        task: task.task,
        status: task.status,
        deadline: task.deadline
      });

      return acc;
    }, {});

    res.json({ groupId, members: summary });
  } catch (err) {
    console.error('❌ Lỗi MCP getGroupStatus:', err.message);
    res.status(500).json({ error: 'Không thể lấy dữ liệu nhóm' });
  }
};

// Gợi ý thêm controller tạo nhiệm vụ
exports.createTask = async (req, res) => {
  try {
    const { groupId, userId, task, description, deadline } = req.body;
    const createdBy = req.user.userId;

    if (!groupId || !userId || !task) {
      return res.status(400).json({ error: 'Thiếu thông tin nhiệm vụ' });
    }

    const newTask = await TaskStatus.create({
      groupId,
      userId,
      createdBy,
      task,
      description,
      deadline
    });

    res.status(201).json({ message: 'Tạo nhiệm vụ thành công', task: newTask });
  } catch (err) {
    console.error('❌ Lỗi MCP createTask:', err.message);
    res.status(500).json({ error: 'Không thể tạo nhiệm vụ' });
  }
};