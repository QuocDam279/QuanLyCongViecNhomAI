// backend/services/ai-service/service/contextService.js
const axios = require('axios');

exports.getContext = async (userId, groupId) => {
  const headers = {
    Authorization: `Bearer ${process.env.INTERNAL_API_KEY}`
  };

  try {
    const [documents, activities, mcp] = await Promise.all([
      axios.get(`http://document-service:5003/api/documents/group/${groupId}`, { headers }),
      axios.get(`http://activity-service:5004/api/activities/group/${groupId}`, { headers }),
      axios.get(`http://mcp-service:5007/api/mcp/group/${groupId}`, { headers })
    ]);

    return {
      documents: documents.data,
      activities: activities.data,
      mcp: mcp.data
    };
  } catch (err) {
    console.error('❌ Lỗi lấy ngữ cảnh:', err.message, err.response?.data || '');
    return {
      documents: [],
      activities: [],
      mcp: {}
    };
  }
};