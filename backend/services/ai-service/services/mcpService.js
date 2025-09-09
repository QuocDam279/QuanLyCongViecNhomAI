const axios = require('axios');

exports.getAdditionalData = async (groupId) => {
  try {
    const response = await axios.get(`http://mcp-server:5007/api/mcp/group/${groupId}`);
    return response.data;
  } catch (err) {
    console.error('❌ Lỗi gọi MCP Server:', err.message);
    return {};
  }
};