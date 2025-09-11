// backend/api-gateway/controllers/proxyController.js
const axios = require('axios');
const FormData = require('form-data');

exports.forwardToService = async (req, res) => {
  const { service } = req.params;
  const method = req.method.toLowerCase();

  // Tự động xác định prefix cần loại bỏ: /api/<service>
  const servicePrefix = `/api/${service.split('_')[0]}`;
  const url = `${process.env[service.toUpperCase()]}${req.originalUrl.replace(servicePrefix, '')}`;

  try {
    let config = {
      method,
      url,
      headers: {
        Authorization: req.headers.authorization
      }
    };

    // Nếu là form-data (upload ảnh hoặc tài liệu)
    if (req.is('multipart/form-data')) {
      const form = new FormData();

      // Thêm các trường text
      for (const key in req.body) {
        form.append(key, req.body[key]);
      }

      // Xác định tên field file dựa trên service
      const fileFieldName = service === 'document_service' ? 'file' : 'avatar';

      // Thêm file nếu có
      if (Array.isArray(req.files)) {
        req.files.forEach((file) => {
          form.append('file', file.buffer, {
            filename: file.originalname,
            contentType: file.mimetype
          });
        });
      }
      config.data = form;
      config.headers = {
        ...form.getHeaders(),
        Authorization: req.headers.authorization
      };
    } else {
      // Nếu là JSON
      config.data = req.body;
    }

    const response = await axios(config);
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error(`❌ Lỗi gọi ${service}:`, err.message);
    res.status(err.response?.status || 500).json({ error: err.message });
  }

};