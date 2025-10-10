const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables from .env file

const mailConfig = {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: true, // Assuming this value doesn't change, adjust if needed
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(mailConfig);

const sendEmail = async (to, subject, html) => {
  try {
    const message = {
      from: process.env.MAIL_FROM_ADDRESS,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(message);
    console.log('Email sent: %s', info.messageId);

    return { success: true, message: 'Email sent successfully.' };
  } catch (error) {
    console.error('Error sending email:', error.message);
    return { success: false, message: 'Failed to send email.' };
  }
};

module.exports = { sendEmail };