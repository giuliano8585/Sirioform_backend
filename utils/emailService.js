const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port:587,
  secure: false,
  auth: {
    user: 'apikey', 
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: 'ijazafridi.dev@gmail.com',
    to: to, 
    subject: subject,
    text: text, 
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

module.exports = sendEmail;




// const mailgun = require('mailgun-js');
// require('dotenv').config();

// console.log('MAILGUN_API_KEY:', process.env.MAILGUN_API_KEY);
// console.log('MAILGUN_DOMAIN:', process.env.MAILGUN_DOMAIN);

// const DOMAIN = process.env.MAILGUN_DOMAIN;
// const mg = mailgun({
//   apiKey: process.env.MAILGUN_API_KEY,
//   domain: DOMAIN,
// });

// const sendEmail = (to, subject, text) => {
//   const data = {
//     from: 'SirioForm <noreply@iltuodominio.com>',
//     to, 
//     subject, 
//     text,
//   };
//   mg.messages().send(data, (error, body) => {
//     if (error) {
//       console.error('Error sending email:', error);
//     } else {
//       console.log('Email sent successfully:', body);
//     }
//   });
// };

// module.exports = sendEmail;


