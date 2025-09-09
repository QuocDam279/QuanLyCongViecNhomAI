//backend/services/activity-service/controllers/activityController.js
const mongoose = require('mongoose');
const Activity = require('../models/Activity');

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

    const timeline = await mongoose.connection.collection('activities').aggregate([
      {
        $match: {
          groupId: new mongoose.Types.ObjectId(groupId)
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'performedBy',
          foreignField: '_id',
          as: 'performedBy'
        }
      },
      {
        $unwind: {
          path: '$performedBy',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'documents',
          localField: 'documentId',
          foreignField: '_id',
          as: 'document'
        }
      },
      {
        $unwind: {
          path: '$document',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          type: 1,
          description: 1,
          timestamp: 1,
          groupId: 1,
          performedBy: {
            _id: '$performedBy._id',
            name: '$performedBy.name',
            email: '$performedBy.email'
          },
          document: {
            _id: '$document._id',
            title: '$document.title'
          }
        }
      }
    ]).toArray();

    res.json(timeline);
  } catch (err) {
    console.error('❌ Lỗi lấy timeline nhóm:', err.message);
    res.status(500).json({ error: err.message });
  }
};
