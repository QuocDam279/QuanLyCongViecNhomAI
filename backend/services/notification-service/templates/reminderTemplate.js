//backend/services/notification-service/templates/reminderTemplate.js
exports.generateReminderEmail = ({ name, task, deadline, remindType }) => {
  let intro = '';

  switch (remindType) {
    case '2_days_before':
      intro = '📅 Còn 2 ngày nữa là đến hạn!';
      break;
    case '1_day_before':
      intro = '⏰ Ngày mai là hạn chót!';
      break;
    case 'today':
      intro = '🚨 Hôm nay là hạn cuối!';
      break;
    default:
      intro = '📌 Đây là lời nhắc công việc.';
  }

  return `
    <h2>Xin chào ${name},</h2>
    <p>${intro}</p>
    <p>Nhiệm vụ: <strong>${task}</strong></p>
    <p>Hạn chót: <strong>${new Date(deadline).toLocaleDateString()}</strong></p>
    <p>Vui lòng hoàn thành đúng thời hạn để đảm bảo tiến độ nhóm.</p>
    <br>
    <p>Trân trọng,<br>Nhóm AI</p>
  `;
};