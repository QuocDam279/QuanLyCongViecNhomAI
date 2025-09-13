// backend/services/ai-service/services/mcpService.js
const axios = require('axios');

exports.getAdditionalData = async (groupId) => {
  const headers = {
    Authorization: `Bearer ${process.env.INTERNAL_API_KEY}`
  };

  try {
    const response = await axios.get(`http://mcp-service:5007/api/mcp/group/${groupId}`, { headers });
    return response.data;
  } catch (err) {
    console.error('❌ Lỗi gọi MCP Server:', err.message, err.response?.data || '');
    return {};
  }
};