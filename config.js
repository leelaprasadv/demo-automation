module.exports.READ_MAIL_CONFIG = {
  imap: {
    user: process.env.EMAIL_USER || '',
    password: process.env.EMAIL_PASS || '',
    host: process.env.EMAIL_HOST || 'imap.gmail.com',
    port:  process.env.EMAIL_PORT || 993,
    authTimeout: 10000,
    tls: true,
    tlsOptions: { rejectUnauthorized: false },
  },
};