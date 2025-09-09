// backend/services/ai-service/service/contextService.js
const axios = require('axios');

exports.getContext = async (userId, groupId) => {
  try {
    const [documents, activities] = await Promise.all([
      axios.get(`http://document-service:5003/api/documents/group/${groupId}`),
      axios.get(`http://activity-service:5004/api/activities/group/${groupId}`)
    ]);
    return { documents: documents.data, activities: activities.data };
  } catch (err) {
    console.error('❌ Lỗi lấy ngữ cảnh:', err.message);
    return { documents: [], activities: [] };
  }
};