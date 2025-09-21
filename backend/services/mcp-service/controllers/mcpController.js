// backend/services/mcp-service/controllers/mcpController.js
const mongoose = require('mongoose');
const axios = require('axios');
const TaskStatus = require('../models/TaskStatus');


// Lấy danh sách nhiệm vụ theo nhóm
exports.getGroupStatus = async (req, res) => {
  try {
    const { groupId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ error: 'groupId không hợp lệ' });
    }

    const tasks = await TaskStatus.find({ groupId });
    const summary = {};

    for (const task of tasks) {
      const userId = task.userId.toString();

      if (!summary[userId]) {
        try {
          const userRes = await axios.get(
            `http://auth-service:5001/api/user/${userId}`,
            { headers: { Authorization: req.headers.authorization } }
          );
          const user = userRes.data;
          summary[userId] = {
            user: {
              _id: user._id,
              name: user.name,
              email: user.email
            },
            tasks: []
          };
        } catch (err) {
          console.warn(`⚠️ Không thể lấy thông tin userId ${userId}: ${err.response?.status || err.message}`);
          summary[userId] = { user: null, tasks: [] };
        }
      }

      summary[userId].tasks.push({
        _id: task._id,
        task: task.task,
        status: task.status,
        deadline: task.deadline
      });
    }

    res.json({ groupId, members: summary });
  } catch (err) {
    console.error('❌ Lỗi getGroupStatus:', err.message);
    res.status(500).json({ error: 'Không thể lấy dữ liệu nhóm' });
  }
};

// Tạo nhiệm vụ mới
exports.createTask = async (req, res) => {
  try {
    const { groupId, userId, task, description, deadline, tags, status, attachments } = req.body;
    const createdBy = req.user?.userId;

    // Kiểm tra các field bắt buộc
    if (!groupId || !userId || !task || !deadline) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc (groupId, userId, task, deadline)' });
    }

    if (
      !mongoose.Types.ObjectId.isValid(groupId) ||
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(createdBy)
    ) {
      return res.status(400).json({ error: 'ID không hợp lệ' });
    }

    // Kiểm tra deadline hợp lệ
    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) {
      return res.status(400).json({ error: 'Deadline không hợp lệ' });
    }

    const newTask = await TaskStatus.create({
      groupId,
      userId,
      createdBy,
      task,
      description,
      deadline: deadlineDate,
      status: status || 'pending', // mặc định pending nếu frontend không gửi
      tags,
      attachments // giờ chỉ nhận từ JSON body
    });

    res.status(201).json({ message: 'Tạo nhiệm vụ thành công', task: newTask });
  } catch (err) {
    console.error('❌ Lỗi createTask:', err.message);
    res.status(500).json({ error: 'Không thể tạo nhiệm vụ' });
  }
};

// Cập nhật trạng thái nhiệm vụ
exports.updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ error: 'taskId không hợp lệ' });
    }

    if (!['pending', 'in_progress', 'reviewing', 'done'].includes(status)) {
      return res.status(400).json({ error: 'Trạng thái không hợp lệ' });
    }

    const update = { status };
    if (status === 'done') update.completedAt = new Date();

    const updated = await TaskStatus.findByIdAndUpdate(taskId, update, { new: true });
    res.json({ message: 'Cập nhật trạng thái thành công', task: updated });
  } catch (err) {
    console.error('❌ Lỗi updateTaskStatus:', err.message);
    res.status(500).json({ error: 'Không thể cập nhật trạng thái' });
  }
};

// Thêm bình luận vào nhiệm vụ
exports.addComment = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { message } = req.body;
    const userId = req.user?.userId;

    if (!mongoose.Types.ObjectId.isValid(taskId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'ID không hợp lệ' });
    }

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Nội dung bình luận không được để trống' });
    }

    const task = await TaskStatus.findByIdAndUpdate(
      taskId,
      {
        $push: {
          comments: {
            userId,
            message,
            createdAt: new Date()
          }
        }
      },
      { new: true }
    );

    res.json({ message: 'Thêm bình luận thành công', task });
  } catch (err) {
    console.error('❌ Lỗi addComment:', err.message);
    res.status(500).json({ error: 'Không thể thêm bình luận' });
  }
};

// Lấy danh sách nhiệm vụ của một user
exports.getUserTasks = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'userId không hợp lệ' });
    }

    const tasks = await TaskStatus.find({ userId });
    res.json(tasks);
  } catch (err) {
    console.error('❌ Lỗi getUserTasks:', err.message);
    res.status(500).json({ error: 'Không thể lấy danh sách nhiệm vụ' });
  }
};

// Xóa nhiệm vụ
exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ error: 'taskId không hợp lệ' });
    }

    await TaskStatus.findByIdAndDelete(taskId);
    res.json({ message: 'Xóa nhiệm vụ thành công' });
  } catch (err) {
    console.error('❌ Lỗi deleteTask:', err.message);
    res.status(500).json({ error: 'Không thể xóa nhiệm vụ' });
  }
};

exports.getTaskDetail = async (req, res) => {
  try {
    const { taskId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ error: 'taskId không hợp lệ' });
    }

    // Lấy task kèm thông tin group (chỉ _id)
    const task = await TaskStatus.findById(taskId).populate('groupId', '_id');
    if (!task) return res.status(404).json({ error: 'Không tìm thấy nhiệm vụ' });

    const authHeader = { headers: { Authorization: req.headers.authorization } };

    // Lấy thông tin user thực hiện
    let user = null;
    try {
      const resUser = await axios.get(`http://auth-service:5001/api/user/${task.userId}`, authHeader);
      user = resUser.data;
    } catch (err) {
      console.warn(`⚠️ Không lấy được thông tin userId ${task.userId}: ${err.response?.status || err.message}`);
    }

    // Lấy thông tin người tạo
    let createdBy = null;
    try {
      const resCreated = await axios.get(`http://auth-service:5001/api/user/${task.createdBy}`, authHeader);
      createdBy = resCreated.data;
    } catch (err) {
      console.warn(`⚠️ Không lấy được thông tin createdBy ${task.createdBy}: ${err.response?.status || err.message}`);
    }

    // Lấy thông tin bình luận
    const commentsWithUser = await Promise.all(
      (task.comments || []).map(async (c) => {
        let commentUser = null;
        try {
          const resC = await axios.get(`http://auth-service:5001/api/user/${c.userId}`, authHeader);
          commentUser = resC.data;
        } catch (err) {
          console.warn(`⚠️ Không lấy được thông tin bình luận userId ${c.userId}: ${err.response?.status || err.message}`);
        }
        return { ...c.toObject(), user: commentUser };
      })
    );

    res.json({
      ...task.toObject(),
      user,           // người thực hiện
      createdBy,      // người tạo
      comments: commentsWithUser
    });
  } catch (err) {
    console.error('❌ Lỗi getTaskDetail:', err.message);
    res.status(500).json({ error: 'Không thể lấy chi tiết nhiệm vụ' });
  }
};

// 📅 Lấy danh sách nhiệm vụ sắp đến hạn
exports.getUpcomingDeadlines = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const twoDaysLater = new Date(today);
    twoDaysLater.setDate(today.getDate() + 2);

    // Lấy nhiệm vụ có deadline trong 3 ngày tới và chưa hoàn thành
    const tasks = await TaskStatus.find({
      deadline: { $gte: today, $lte: twoDaysLater },
      status: { $ne: 'done' }
    });

    const reminders = [];

    for (const task of tasks) {
      const deadlineDate = new Date(task.deadline);
      deadlineDate.setHours(0, 0, 0, 0);

      let remindType = null;
      if (deadlineDate.getTime() === today.getTime()) {
        remindType = 'today';
      } else if (deadlineDate.getTime() === tomorrow.getTime()) {
        remindType = '1_day_before';
      } else if (deadlineDate.getTime() === twoDaysLater.getTime()) {
        remindType = '2_days_before';
      }

      if (remindType) {
        try {
          const userRes = await axios.get(
            `http://auth-service:5001/api/user/${task.userId}`,
            {
              headers: {
                Authorization: `Bearer ${process.env.INTERNAL_API_KEY}`
              }
            }
          );

          const user = userRes.data;

          reminders.push({
            email: user.email,
            name: user.name,
            task: task.task,
            deadline: task.deadline,
            remindType
          });
        } catch (err) {
          console.warn(`⚠️ Không thể lấy thông tin userId ${task.userId}: ${err.message}`);
        }
      }
    }

    res.json(reminders);
  } catch (err) {
    console.error('❌ Lỗi getUpcomingDeadlines:', err.message);
    res.status(500).json({ error: 'Không thể lấy danh sách deadline' });
  }
};

// ✏️ Cập nhật toàn bộ thông tin nhiệm vụ
exports.updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const updateData = req.body;

    const updated = await TaskStatus.findByIdAndUpdate(taskId, updateData, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ error: "Không tìm thấy nhiệm vụ" });
    }

    res.json(updated);
  } catch (err) {
    console.error("❌ Lỗi updateTask:", err);
    res.status(500).json({ error: "Cập nhật nhiệm vụ thất bại" });
  }
};