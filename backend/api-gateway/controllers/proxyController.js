// backend/api-gateway/controllers/proxyController.js
const axios = require('axios');

exports.forwardToService = async (req, res) => {
  const { service, path } = req.params;
  const method = req.method.toLowerCase();
  const url = `${process.env[service.toUpperCase()]}${path ? '/' + path : ''}`;

  try {
    const response = await axios({
      method,
      url,
      data: req.body,
      headers: {
        Authorization: req.headers.authorization
      }
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error(`❌ Lỗi gọi ${service}:`, err.message);
    res.status(err.response?.status || 500).json({ error: err.message });
  }
};