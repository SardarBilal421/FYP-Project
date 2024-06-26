// const nodemailer = require('nodemailer');

// const sendEmail = async (option) => {
//   // Create Transporter
//   const transport = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     // service: 'gmail',
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });

//   //DEFINING THE EMIAL OPTION
//   const mailOptions = {
//     from: 'SardarBilal <rockeykhan142@gmail.com>',
//     to: option.email,
//     subject: option.subject,
//     text: option.message,
//   };

//   await transport.sendMail(mailOptions);
// };

// module.exports = sendEmail;

const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config({ path: './../config.env' });

const sendEmail = async (option) => {
  // create a transporter object
  let transporter = nodemailer.createTransport({
    host: 'smtp.mailgun.org',
    port: 587,
    secure: false,
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });

  const mailOptions = {
    from: `Excited User <${process.env.FROM}>`,
    to: option.email,
    subject: option.subject,
    text: option.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
