//backend/services/document-service/controllers/documentController.js
const mongoose = require('mongoose');
const Document = require('../models/Document');
const path = require('path');
const axios = require('axios');
const logActivity = require('../utils/logActivityFromService');

// Upload file trực tiếp
exports.uploadDocument = async (req, res) => {
  try {
    const { title, groupId } = req.body;

    if (!Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ error: 'Chưa có file upload' });
    }

    if (!title || !groupId) {
      return res.status(400).json({ error: 'Thiếu tiêu đề hoặc groupId' });
    }

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ error: 'groupId không hợp lệ' });
    }

    if (!req.user || !mongoose.Types.ObjectId.isValid(req.user.userId)) {
      return res.status(401).json({ error: 'Thông tin người dùng không hợp lệ' });
    }

    const uploadedBy = new mongoose.Types.ObjectId(req.user.userId);
    const groupObjectId = new mongoose.Types.ObjectId(groupId);

    const documents = await Promise.all(
      req.files.map(async (file) => {
        const doc = await Document.create({
          title,
          source: 'upload',
          filePath: `/files/${file.filename}`,
          uploadedBy,
          groupId: groupObjectId
        });

        // Ghi log hoạt động
        await logActivity({
          type: 'upload',
          description: `Người dùng đã upload tài liệu "${title}"`,
          groupId,
          documentId: doc._id,
          token: req.headers.authorization
        });

        return doc;
      })
    );

    res.status(201).json({
      message: 'Tải nhiều tài liệu thành công',
      documents
    });
  } catch (err) {
    console.error('❌ Lỗi uploadDocument:', err.message);
    res.status(500).json({ error: 'Lỗi máy chủ khi upload tài liệu' });
  }
};


// Liên kết tài liệu từ nguồn ngoài
exports.linkDocument = async (req, res) => {
  try {
    const { title, source, link, groupId } = req.body;

    if (!title || !source || !link || !groupId) {
      return res.status(400).json({ error: 'Thiếu thông tin liên kết tài liệu' });
    }

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ error: 'groupId không hợp lệ' });
    }

    if (!req.user || !mongoose.Types.ObjectId.isValid(req.user.userId)) {
      return res.status(401).json({ error: 'Thông tin người dùng không hợp lệ' });
    }

    const doc = await Document.create({
      title,
      source,
      link,
      uploadedBy: new mongoose.Types.ObjectId(req.user.userId),
      groupId: new mongoose.Types.ObjectId(groupId)
    });

    // Ghi log hoạt động
    await logActivity({
      type: 'link',
      description: `Người dùng đã liên kết tài liệu "${title}" từ nguồn ${source}`,
      groupId,
      documentId: doc._id,
      token: req.headers.authorization
    });

    res.status(201).json({
      message: 'Liên kết tài liệu thành công',
      document: doc
    });
  } catch (err) {
    console.error('❌ Lỗi linkDocument:', err.message);
    console.log('📥 req.body:', req.body);
    console.log('👤 req.user:', req.user);
    res.status(500).json({ error: 'Lỗi máy chủ khi liên kết tài liệu' });
  }
};


// Lấy danh sách tài liệu của nhóm (dùng API để lấy thông tin người dùng)
exports.getDocumentsByGroup = async (req, res) => {
  try {
    const { groupId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ error: 'groupId không hợp lệ' });
    }

    const docs = await Document.find({ groupId });

    const enrichedDocs = [];

    for (const doc of docs) {
      const userId = doc.uploadedBy.toString();

      try {
        const userRes = await axios.get(
          `http://auth-service:5001/api/user/${userId}`,
          {
            headers: {
              Authorization: req.headers.authorization
            }
          }
        );

        const user = userRes.data;

        enrichedDocs.push({
          ...doc.toObject(),
          uploadedBy: {
            _id: user._id,
            name: user.name,
            email: user.email
          }
        });
      } catch (err) {
        console.warn(`⚠️ Không thể lấy thông tin userId ${userId}: ${err.response?.status || err.message}`);
        enrichedDocs.push({
          ...doc.toObject(),
          uploadedBy: null
        });
      }
    }

    res.json(enrichedDocs);
  } catch (err) {
    console.error('❌ Lỗi getDocumentsByGroup:', err.message);
    res.status(500).json({ error: 'Lỗi máy chủ khi lấy danh sách tài liệu' });
  }
};


// Xóa tài liệu
exports.deleteDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      return res.status(400).json({ error: 'documentId không hợp lệ' });
    }

    await Document.findByIdAndDelete(documentId);

    res.json({ message: 'Xóa tài liệu thành công' });
  } catch (err) {
    console.error('❌ Lỗi deleteDocument:', err.message);
    res.status(500).json({ error: 'Lỗi máy chủ khi xóa tài liệu' });
  }
};