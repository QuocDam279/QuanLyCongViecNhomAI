// backend/services/ai-service/services/llmService.js
const axios = require('axios');

exports.askLLM = async (query, context) => {
  const prompt = `
Câu hỏi: ${query}

📄 Tài liệu:
${context.documents?.length
  ? context.documents.map(doc => `- ${doc.title}: ${doc.summary || ''}`).join('\n')
  : 'Không có tài liệu nào.'}

📊 Hoạt động nhóm:
${context.activities?.length
  ? context.activities.map(act => `- ${act.description} (${act.timestamp})`).join('\n')
  : 'Không có hoạt động nào.'}

📈 Tiến độ nhóm:
${context.mcp ? JSON.stringify(context.mcp, null, 2) : 'Chưa có dữ liệu tiến độ.'}
`;

  try {
    const response = await axios.post(
      process.env.LLM_ENDPOINT,
      {
        model: process.env.LLM_MODEL || 'mistralai/mistral-7b-instruct',
        messages: [
          { role: 'user', content: prompt }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const choices = response.data?.choices;
    if (choices && choices.length > 0 && choices[0].message?.content) {
      return choices[0].message.content;
    } else {
      console.warn('⚠️ Model không trả về nội dung hợp lệ:', response.data);
      return 'Xin lỗi, tôi chưa thể trả lời câu hỏi này.';
    }
  } catch (err) {
    console.error('❌ Lỗi gọi model qua OpenRouter:', err.message, err.response?.data || '');
    return 'Xin lỗi, tôi chưa thể trả lời câu hỏi này.';
  }
};