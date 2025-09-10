//backend/services/notification-service/templates/reminderTemplate.js
exports.generateReminderEmail = ({ name, task, deadline }) => {
  return `
    <h2>Xin chào ${name},</h2>
    <p>Đây là lời nhắc về công việc: <strong>${task}</strong></p>
    <p>Hạn chót: <strong>${deadline}</strong></p>
    <p>Vui lòng hoàn thành đúng thời hạn để đảm bảo tiến độ nhóm.</p>
    <br>
    <p>Trân trọng,<br>Nhóm AI</p>
  `;
};