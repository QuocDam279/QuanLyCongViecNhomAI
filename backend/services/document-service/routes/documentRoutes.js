const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const {
  uploadDocument,
  linkDocument,
  getDocumentsByGroup,
  deleteDocument
} = require('../controllers/documentController');

// Cấu hình multer để lưu file vào uploads/
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Routes
router.post('/upload', auth, upload.array('file', 5), uploadDocument);
router.post('/link', auth, linkDocument);
router.get('/group/:groupId', auth, getDocumentsByGroup);
router.delete('/:documentId', auth, deleteDocument);

module.exports = router;