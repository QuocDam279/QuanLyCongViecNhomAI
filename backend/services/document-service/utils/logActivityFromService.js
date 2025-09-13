const axios = require('axios');

const logActivityFromService = async ({ type, description, groupId, documentId, token }) => {
  try {
    await axios.post('http://activity-service:5004/api/activities', {
      type,
      description,
      groupId,
      documentId
    }, {
      headers: { Authorization: token }
    });
  } catch (err) {
    console.warn('⚠️ Không thể ghi log hoạt động:', err.message);
  }
};

module.exports = logActivityFromService;