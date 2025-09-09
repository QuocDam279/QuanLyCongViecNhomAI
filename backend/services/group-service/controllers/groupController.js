// controllers/groupController.js
const mongoose = require('mongoose');
const Group = require('../models/Group');
const GroupMember = require('../models/GroupMember');
const User = require('../models/User'); // để lấy thông tin user thủ công

// Tạo nhóm mới
exports.createGroup = async (req, res) => {
  try {
    const { name, description } = req.body;

    const group = await Group.create({
      name,
      description,
      createdBy: req.user.userId
    });

    // Thêm người tạo vào danh sách thành viên với vai trò leader
    await GroupMember.create({
      groupId: group._id,
      userId: new mongoose.Types.ObjectId(req.user.userId),
      role: 'leader'
    });

    res.status(201).json({ message: 'Tạo nhóm thành công', group });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mời thành viên
exports.inviteMember = async (req, res) => {
  try {
    const { userId, role } = req.body;
    const { groupId } = req.params;

    const existing = await GroupMember.findOne({ groupId, userId });
    if (existing) return res.status(400).json({ error: 'Thành viên đã tồn tại' });

    const member = await GroupMember.create({
      groupId: new mongoose.Types.ObjectId(groupId),
      userId: new mongoose.Types.ObjectId(userId),
      role: role || 'member'
    });

    res.status(201).json({ message: 'Mời thành viên thành công', member });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Phân công vai trò
exports.assignRole = async (req, res) => {
  try {
    const { userId, role } = req.body;
    const { groupId } = req.params;

    const member = await GroupMember.findOneAndUpdate(
      { groupId, userId },
      { role },
      { new: true }
    );

    if (!member) return res.status(404).json({ error: 'Không tìm thấy thành viên' });

    res.json({ message: 'Cập nhật vai trò thành công', member });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy danh sách thành viên (không dùng populate)
exports.getMembers = async (req, res) => {
  try {
    const { groupId } = req.params;

    // Lấy danh sách thành viên
    const members = await GroupMember.find({ groupId }).lean();

    // Lấy danh sách userId
    const userIds = members.map(m => m.userId);

    // Lấy thông tin user tương ứng
    const users = await User.find({ _id: { $in: userIds } }, 'name email').lean();

    // Ghép thông tin user vào từng member
    const result = members.map(m => {
      const userInfo = users.find(u => u._id.toString() === m.userId.toString());
      return {
        ...m,
        user: userInfo || null
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Xóa hoặc rời nhóm
exports.removeMember = async (req, res) => {
  try {
    const { groupId, userId } = req.params;
    await GroupMember.findOneAndDelete({ groupId, userId });
    res.json({ message: 'Xóa thành viên thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};