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

// Mời thành viên bằng email
exports.inviteMember = async (req, res) => {
  try {
    const { email, role } = req.body;
    const { groupId } = req.params;

    // kiểm tra group tồn tại
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: "Nhóm không tồn tại" });

    // 🔗 gọi sang auth-service để tìm user theo email
    let user;
    try {
      const response = await axios.get(
        `http://auth-service:5001/api/user/by-email/${encodeURIComponent(email)}`,
        { headers: { Authorization: req.headers.authorization } }
      );
      user = response.data;
    } catch (err) {
      return res.status(404).json({ error: "Tài khoản không tồn tại" });
    }

    // kiểm tra trùng
    const existing = await GroupMember.findOne({ groupId, userId: user._id });
    if (existing) return res.status(400).json({ error: "Thành viên đã tồn tại" });

    // thêm member
    const member = await GroupMember.create({
      groupId: new mongoose.Types.ObjectId(groupId),
      userId: new mongoose.Types.ObjectId(user._id),
      role: role || "member",
    });

    res.status(201).json({
      message: "Mời thành viên thành công",
      member: {
        ...member.toObject(),
        user: { _id: user._id, name: user.name, email: user.email }
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Phân công vai trò
// Phân công vai trò (chỉ leader mới được chuyển leader)
exports.assignRole = async (req, res) => {
  try {
    const { userId, role } = req.body;
    const { groupId } = req.params;

    // Kiểm tra member mới tồn tại
    const memberToUpdate = await GroupMember.findOne({ groupId, userId });
    if (!memberToUpdate) return res.status(404).json({ error: 'Không tìm thấy thành viên' });

    if (role === 'leader') {
      // Tìm leader hiện tại và hạ quyền thành member
      await GroupMember.updateMany(
        { groupId, role: 'leader' },
        { role: 'member' }
      );
    }

    // Gán role mới cho member
    memberToUpdate.role = role;
    await memberToUpdate.save();

    res.json({ message: 'Cập nhật vai trò thành công', member: memberToUpdate });
  } catch (err) {
    console.error('assignRole error:', err);
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
    const { groupId, userId: targetUserId } = req.params;
    const requesterId = req.user && req.user.userId; // id người gọi API (từ auth middleware)

    if (!requesterId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Tìm membership của target và requester
    const targetMember = await GroupMember.findOne({ groupId, userId: targetUserId });
    if (!targetMember) {
      return res.status(404).json({ error: 'Thành viên không tồn tại trong nhóm' });
    }

    // Nếu người gọi là chính người bị xóa -> cho phép (rời nhóm)
    if (requesterId === String(targetUserId) || requesterId === targetUserId) {
      await GroupMember.findOneAndDelete({ groupId, userId: targetUserId });
      return res.json({ message: 'Bạn đã rời nhóm / Thành viên đã được xóa' });
    }

    // Nếu không phải chính họ, kiểm tra requester có phải leader không
    const requesterMember = await GroupMember.findOne({ groupId, userId: requesterId });
    if (!requesterMember || requesterMember.role !== 'leader') {
      return res.status(403).json({ error: 'Chỉ leader mới được xóa thành viên khác' });
    }

    // Ngăn không cho leader xóa leader khác (nếu bạn muốn nghiêm ngặt)
    if (targetMember.role === 'leader') {
      return res.status(403).json({ error: 'Không thể xóa một leader khác' });
    }

    // Thực hiện xóa
    await GroupMember.findOneAndDelete({ groupId, userId: targetUserId });

    return res.json({ message: 'Xóa thành viên thành công' });
  } catch (err) {
    console.error('❌ removeMember error:', err);
    return res.status(500).json({ error: err.message });
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

// Sửa thông tin nhóm (tên, mô tả)
exports.updateGroup = async (req, res) => {
  try {
    const { groupId } = req.params; // lấy id nhóm từ url
    const { name, description } = req.body;

    // kiểm tra nhóm tồn tại
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Nhóm không tồn tại" });
    }

    // chỉ leader mới được sửa nhóm
    const member = await GroupMember.findOne({
      groupId: groupId,
      userId: req.user.userId,
    });

    if (!member || member.role !== "leader") {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền sửa nhóm này" });
    }

    // cập nhật thông tin (cho phép xóa mô tả bằng cách gửi "")
    if (name !== undefined) group.name = name;
    if (description !== undefined) group.description = description;

    await group.save();

    res.status(200).json({ message: "Cập nhật nhóm thành công", group });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


