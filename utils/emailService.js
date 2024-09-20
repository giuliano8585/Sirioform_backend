const mailgun = require('mailgun-js');
const DOMAIN = process.env.MAILGUN_DOMAIN;
const mg = mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN});

const sendEmail = (to, subject, text) => {
  const data = {
    from: 'SirioForm <noreply@iltuodominio.com>',
    to: to,
    subject: subject,
    text: text,
  };

  mg.messages().send(data, function (error, body) {
    if (error) {
      console.log(error);
    } else {
      console.log(body);
    }
  });
};

module.exports = sendEmail;


