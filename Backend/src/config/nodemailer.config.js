const nodeMailerConfig = {
  host: process.env.MAIL_HOST || 'localhost',
  port: process.env.MAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
};

module.exports = nodeMailerConfig;
