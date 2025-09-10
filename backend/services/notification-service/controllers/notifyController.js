//backend/services/notification-service/controllers/notifyController.js
const mailService = require('../services/mailService');
const template = require('../templates/reminderTemplate');

exports.sendReminder = async (req, res) => {
  try {
    const { email, name, task, deadline } = req.body;
    const html = template.generateReminderEmail({ name, task, deadline });

    await mailService.sendMail({
      to: email,
      subject: `Nhắc việc: ${task}`,
      html
    });

    res.json({ success: true, message: 'Email đã được gửi' });
  } catch (err) {
    console.error('❌ Lỗi gửi email:', err.message);
    res.status(500).json({ error: 'Không thể gửi email' });
  }
};