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
  deleteGroup
} = require('../controllers/groupController');

router.post('/', auth, createGroup);
router.post('/:groupId/add-member', auth, inviteMember);
router.patch('/:groupId/role', auth, assignRole);
router.get('/:groupId/members', auth, getMembers);
router.get('/my-groups', auth, getUserGroups);
router.delete('/:groupId/members/:userId', auth, removeMember);
router.delete('/:groupId', auth, deleteGroup);

module.exports = router;