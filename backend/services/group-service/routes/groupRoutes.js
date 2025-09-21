const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  createGroup,
  inviteMember,
  assignRole,
  getMembers,
  removeMember,
  getUserGroups,
  deleteGroup,
  updateGroup // 👈 thêm controller updateGroup
} = require('../controllers/groupController');

// Tạo nhóm mới
router.post('/', auth, createGroup);

// Mời thành viên
router.post('/:groupId/add-member', auth, inviteMember);

// Phân quyền
router.patch('/:groupId/role', auth, assignRole);

// Lấy danh sách thành viên
router.get('/:groupId/members', auth, getMembers);

// Lấy nhóm của user hiện tại
router.get('/my-groups', auth, getUserGroups);

// Xóa thành viên khỏi nhóm
router.delete('/:groupId/members/:userId', auth, removeMember);

// Cập nhật thông tin nhóm (tên, mô tả)
router.patch('/:groupId', auth, updateGroup); // 👈 thêm route update

// Xóa nhóm
router.delete('/:groupId', auth, deleteGroup);

module.exports = router;
