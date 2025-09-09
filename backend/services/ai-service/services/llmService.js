const axios = require('axios');

exports.askLLM = async (query, context) => {
  const prompt = `
    Câu hỏi: ${query}
    Tài liệu: ${JSON.stringify(context.documents)}
    Hoạt động nhóm: ${JSON.stringify(context.activities)}
  `;

  try {
    const response = await axios.post(
      process.env.LLM_ENDPOINT,
      {
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'Bạn là trợ lý AI hỗ trợ nhóm làm việc.' },
          { role: 'user', content: prompt }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (err) {
    console.error('❌ Lỗi gọi GPT:', err.message);
    return 'Xin lỗi, tôi chưa thể trả lời câu hỏi này.';
  }
};