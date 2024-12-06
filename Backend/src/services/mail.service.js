const nodemailer = require('nodemailer');
const nodeMailerConfig = require('../config/nodemailer.config');
const fs = require('fs');
const path = require('path');

const MailService = module.exports;

const transporter = nodemailer.createTransport(nodeMailerConfig);

MailService.sendCodeForgotPassword = async (email, code) => {
  const htmlFilePath = path.join(path.resolve(__dirname, '..'), '/templates/send-code-forgot-passoword.html');
  fs.readFile(htmlFilePath, 'utf-8', async (err, htmlContent) => {
    if (err) {
      console.error('Error reading HTML file:', err);
      return res.status(500).json({ message: 'Error reading HTML file', error: err });
    }

    const mailOptions = {
      from: 'no-reply@xample.com',
      to: email,
      subject: "Forgotten password code",
      html: htmlContent.replace('{{code}}', code),
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  });
};
