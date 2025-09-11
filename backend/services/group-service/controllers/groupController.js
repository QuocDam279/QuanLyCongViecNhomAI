// controllers/groupController.js
const axios = require('axios');
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

    const members = await GroupMember.find({ groupId }).lean();

    const enrichedMembers = await Promise.all(
      members.map(async (m) => {
        try {
          const response = await axios.get(
            `http://auth-service:5001/api/user/${m.userId}`,
            {
              headers: { Authorization: req.headers.authorization }
            }
          );
          return {
            ...m,
            user: response.data
          };
        } catch (err) {
          return {
            ...m,
            user: null
          };
        }
      })
    );

    res.json(enrichedMembers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Lấy danh sách nhóm của người dùng hiện tại
exports.getUserGroups = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Tìm tất cả groupId mà user đang tham gia
    const memberships = await GroupMember.find({ userId }).lean();
    const groupIds = memberships.map(m => m.groupId);

    // Lấy thông tin nhóm tương ứng
    const groups = await Group.find({ _id: { $in: groupIds } }).lean();

    res.json({
      success: true,
      groups
    });
  } catch (err) {
    console.error('❌ Lỗi lấy nhóm của người dùng:', err.message);
    res.status(500).json({ success: false, error: err.message });
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

// Xóa nhóm (chỉ leader hoặc người tạo nhóm mới được phép)
exports.deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.userId;

    // Kiểm tra xem người dùng có phải là leader của nhóm không
    const member = await GroupMember.findOne({ groupId, userId });
    if (!member || member.role !== 'leader') {
      return res.status(403).json({ error: 'Chỉ leader mới được phép xóa nhóm' });
    }

    // Xóa tất cả thành viên trong nhóm
    await GroupMember.deleteMany({ groupId });

    // Xóa nhóm
    await Group.findByIdAndDelete(groupId);

    res.json({ message: 'Đã xóa nhóm thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
