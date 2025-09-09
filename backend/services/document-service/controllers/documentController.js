const mongoose = require('mongoose');
const Document = require('../models/Document');
const path = require('path');

// Upload file trực tiếp
exports.uploadDocument = async (req, res) => {
  try {
    const { title, groupId } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Chưa có file upload' });
    }

    const doc = await Document.create({
      title,
      source: 'upload',
      filePath: `/files/${req.file.filename}`,
      uploadedBy: new mongoose.Types.ObjectId(req.user.userId), // ép kiểu
      groupId: new mongoose.Types.ObjectId(groupId)
    });

    res.status(201).json({
      message: 'Tải tài liệu thành công',
      document: doc
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Liên kết tài liệu từ nguồn ngoài
exports.linkDocument = async (req, res) => {
  try {
    const { title, source, link, groupId } = req.body;

    const doc = await Document.create({
      title,
      source,
      link,
      uploadedBy: new mongoose.Types.ObjectId(req.user.userId),
      groupId: new mongoose.Types.ObjectId(groupId)
    });

    res.status(201).json({
      message: 'Liên kết tài liệu thành công',
      document: doc
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy danh sách tài liệu của nhóm (dùng $lookup, không cần populate)
exports.getDocumentsByGroup = async (req, res) => {
  try {
    const { groupId } = req.params;

    const docs = await mongoose.connection
      .collection('documents')
      .aggregate([
        {
          $match: {
            groupId: new mongoose.Types.ObjectId(groupId)
          }
        },
        {
          $lookup: {
            from: 'users',                 // tên collection user trong Mongo
            localField: 'uploadedBy',      // field trong Document
            foreignField: '_id',           // field trong User
            as: 'uploadedBy'
          }
        },
        {
          $unwind: {
            path: '$uploadedBy',
            preserveNullAndEmptyArrays: true // nếu không có user vẫn trả về null
          }
        }
      ])
      .toArray();

    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Xóa tài liệu
exports.deleteDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    await Document.findByIdAndDelete(documentId);

    res.json({ message: 'Xóa tài liệu thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};