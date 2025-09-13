//backend/services/activity-service/controllers/activityController.js
const mongoose = require('mongoose');
const Activity = require('../models/Activity');
const axios = require('axios');

// Ghi nhận một hoạt động nhóm
exports.logActivity = async (req, res) => {
  try {
    const { type, description, groupId, documentId } = req.body;

    const activity = await Activity.create({
      type,
      description,
      performedBy: new mongoose.Types.ObjectId(req.user.userId),
      groupId: new mongoose.Types.ObjectId(groupId),
      documentId: documentId ? new mongoose.Types.ObjectId(documentId) : undefined
    });

    res.status(201).json({
      message: 'Ghi nhận hoạt động thành công',
      activity
    });
  } catch (err) {
    console.error('❌ Lỗi ghi nhận hoạt động:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// Lấy timeline hoạt động của nhóm
exports.getGroupTimeline = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ error: 'groupId không hợp lệ' });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const activities = await Activity.find({ groupId })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const enriched = await Promise.all(
      activities.map(async (act) => {
        const result = {
          _id: act._id,
          type: act.type,
          description: act.description,
          timestamp: act.timestamp,
          groupId: act.groupId
        };

        // Gọi Auth Service để lấy thông tin người thực hiện
        try {
          const userRes = await axios.get(
            `http://auth-service:5001/api/user/${act.performedBy}`,
            {
              headers: {
                Authorization: req.headers.authorization
              }
            }
          );
          result.performedBy = {
            _id: userRes.data._id,
            name: userRes.data.name,
            email: userRes.data.email
          };
        } catch (err) {
          console.warn(`⚠️ Không thể lấy thông tin user ${act.performedBy}: ${err.message}`);
          result.performedBy = null;
        }

        // Gọi Document Service nếu có documentId
        if (act.documentId) {
          try {
            const docRes = await axios.get(
              `http://document-service:5003/api/documents/${act.documentId}`,
              {
                headers: {
                  Authorization: req.headers.authorization
                }
              }
            );
            result.document = {
              _id: docRes.data._id,
              title: docRes.data.title
            };
          } catch (err) {
            console.warn(`⚠️ Không thể lấy thông tin document ${act.documentId}: ${err.message}`);
            result.document = null;
          }
        }

        return result;
      })
    );

    res.json({
      page: parseInt(page),
      limit: parseInt(limit),
      total: enriched.length,
      timeline: enriched
    });
  } catch (err) {
    console.error('❌ Lỗi getGroupTimeline:', err.message);
    res.status(500).json({ error: 'Không thể lấy timeline nhóm' });
  }
};

// Lấy hoạt động gần đây của một người dùng
exports.getUserActivity = async (req, res) => {
  try {
    const { userId } = req.params;
    const requesterId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(requesterId)) {
      return res.status(400).json({ error: 'ID không hợp lệ' });
    }

    // Gọi Auth Service để lấy thông tin requester
    const requesterRes = await axios.get(`http://auth-service:5001/api/user/${requesterId}`, {
      headers: { Authorization: req.headers.authorization }
    });
    const requester = requesterRes.data;

    // Gọi Auth Service để lấy thông tin user được xem
    const targetRes = await axios.get(`http://auth-service:5001/api/user/${userId}`, {
      headers: { Authorization: req.headers.authorization }
    });
    const targetUser = targetRes.data;

    const isSelf = requester._id === targetUser._id;
    const sameGroup = requester.groupId === targetUser.groupId;
    const isLeader = requester.role === 'leader';

    // Phân quyền: cho phép nếu là chính mình, hoặc là leader cùng nhóm
    if (!isSelf && (!sameGroup || !isLeader)) {
      return res.status(403).json({ error: 'Không có quyền xem hoạt động của người này' });
    }

    // Truy vấn hoạt động
    const activities = await Activity.find({ performedBy: userId }).sort({ timestamp: -1 });

    res.json({ userId, activities });
  } catch (err) {
    console.error('❌ Lỗi lấy hoạt động người dùng:', err.message);
    res.status(500).json({ error: 'Không thể lấy hoạt động người dùng' });
  }
};

