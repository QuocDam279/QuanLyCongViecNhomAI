//backend/services/notification-service/services/mailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

exports.sendMail = async ({ to, subject, html }) => {
  return transporter.sendMail({
    from: `"AI Team" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html
  });
};