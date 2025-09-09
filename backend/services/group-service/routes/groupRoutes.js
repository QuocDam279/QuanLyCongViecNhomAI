const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  createGroup,
  inviteMember,
  assignRole,
  getMembers,
  removeMember
} = require('../controllers/groupController');

router.post('/', auth, createGroup);
router.post('/:groupId/invite', auth, inviteMember);
router.patch('/:groupId/role', auth, assignRole);
router.get('/:groupId/members', auth, getMembers);
router.delete('/:groupId/members/:userId', auth, removeMember);

module.exports = router;