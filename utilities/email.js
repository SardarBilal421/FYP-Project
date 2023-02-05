// const mailgun = require('mailgun-js');
// const DOMAIN = 'sandbox85902b3eaeb74a00887f2bf148cc7034.mailgun.org';
// const mg = mailgun({
//   apiKey: 'a5a40527d4abc795b937b0be3c38e995-07e2c238-e0e158b5',
//   domain: DOMAIN,
// });
// const data = {
//   from: 'sardar142bilal@gmail.com',
//   to: 'sardar142bilal@gmail.com',
//   subject: 'Hello',
//   text: 'Testing some Mailgun awesomness!',
// };
// mg.messages().send(data, function (error, body) {
//   console.log(body);
// });

// // const nodemailer = require('nodemailer');
// // const sendGridTransport = require('nodemailer-sendgrid-transport');
// // // Create Transporter
// // const transport = nodemailer.createTransport(
// //   sendGridTransport({
// //     auth: {
// //       api_key:
// //         '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',
// //     },
// //   })
// // );

// // //dEFINING THE EMIAL OPTION
// // const mailOptions = {
// //   from: 'ngcars700@gmail.com',
// //   to: 'hussnainraja768@gmail.com',
// //   subject: 'testinggg',
// //   text: 'asdasdasdadas',
// //   html: '<h1>hello from the other side</h1>',
// // };

// // transport.sendMail(mailOptions, function (err, success) {
// //   if (err) {
// //     console.log(err);
// //   } else {
// //     console.log(success.infi, 'sended succesfully');
// //   }
// // });

// // // const sgMail = require('@sendgrid/mail');
// // // sgMail.setApiKey(
// // //   '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'
// // // );
// // // const msg = {
// // //   to: 'rockeykhan142@gmail.com',
// // //   from: 'ngcars700@gmail.com', // Use the email address or domain you verified above
// // //   subject: 'Sending with Twilio SendGrid is Fun',
// // //   text: 'and easy to do anywhere, even with Node.js',
// // //   html: '<h1>and easy to do anywhere, even with Node.js</h1>',
// // // };
// // // //ES6
// // // sgMail
// // //   .send(msg)
// // //   .then((response) => {
// // //     console.log(response[0].statusCode);
// // //     console.log(response[0].headers);
// // //   })
// // //   .catch((error) => {
// // //     console.error(error);
// // //   });
// // //ES8
// // // (async () => {
// // //   try {
// // //     await sgMail.send(msg);
// // //   } catch (error) {
// // //     console.error(error);

// // //     if (error.response) {
// // //       console.error(error.response.body);
// // //     }
// // //   }
// // // })();

// // // const nodemailer = require('nodemailer');

// // // // Create Transporter
// // // const transport = nodemailer.createTransport({
// // //   service: 'gmail',
// // //   auth: {
// // //     user: 'info.autostamp@gmail.com',
// // //     pass: 'autostamp123',
// // //   },
// // //   tls: {
// // //     rejectUnauthorized: false,
// // //   },
// // // });

// // // //dEFINING THE EMIAL OPTION
// // // const mailOptions = {
// // //   from: 'info.autostamp@gmail.com',
// // //   to: 'rockeykhan142@gmail.com',
// // //   subject: 'testinggg',
// // //   text: 'asdasdasdadas',
// // // };

// // // transport.sendMail(mailOptions, function (err, success) {
// // //   if (err) {
// // //     console.log(err);
// // //   } else {
// // //     console.log('sended succesfully');
// // //   }
// // // });

// // // module.exports = sendEmail;

// // // var SibApiV3Sdk = require('sib-api-v3-sdk');
// // // var defaultClient = SibApiV3Sdk.ApiClient.instance;
// // // // # Instantiate the client\
// // // var apiKey = defaultClient.authentications['api-key'];
// // // apiKey.apiKey =
// // //   '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';
// // // var apiInstance = new SibApiV3Sdk.EmailCampaignsApi();
// // // var emailCampaigns = new SibApiV3Sdk.CreateEmailCampaign();
// // // // Define the campaign settings\
// // // emailCampaigns.name = 'Campaign sent via the API';
// // // emailCampaigns.subject = 'My subject';
// // // emailCampaigns.sender = { name: 'From name', email: 'rockeykhan142@gmail.com' };
// // // emailCampaigns.to = {
// // //   name: 'From name',
// // //   email: 'rockeykhan142@gmail.com',
// // // };

// // // emailCampaigns.type = 'classic';
// // // // # Content that will be sent\
// // // (emailCampaigns.htmlContent =
// // //   'Congratulations! You successfully sent this example campaign via the Sendinblue API.'),
// // //   // # Select the recipients\
// // //   // recipients: {
// // //   //   listIds: [2, 7]
// // //   // },
// // //   // # Schedule the sending in one hour\
// // //   // scheduledAt: '2018-01-01 00:00:01'
// // //   // }
// // //   // # Make the call to the client\
// // //   apiInstance.createEmailCampaign(emailCampaigns).then(
// // //     function (data) {
// // //       console.log('API called successfully. Returned data: ' + data);
// // //     },
// // //     function (error) {
// // //       console.error(error);
// // //     }
// // //   );

// // // const sib = require('sib-api-v3-sdk');

// // // require('dotenv').config();
// // // // dotenv.config({ path: './../config.env' });

// // // const client = sib.ApiClient.instance;

// // // const apiKey = client.authentications['api-key'];

// // // apiKey.apiKey =
// // //   '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';

// // // let ApiInstance = new sib.ContactsApi();
// // // let createContact = new sib.CreateContact();

// // // createContact = { email: 'rockeykhan142@gmail.com' };
// // // createContact.listIds = [2];

// // // ApiInstance.createContact(createContact).then(
// // //   function (data) {
// // //     console.log('API called successfully. Returned data: ' + data);
// // //   },
// // //   function (error) {
// // //     console.error(error);
// // //   }
// // // );

// // // const sender = {
// // //   email: 'rockeykhan142@gmail.com',
// // // };
// // // const receivers = [
// // //   {
// // //     email: 'sardar142bilal@gmail.com',
// // //   },
// // // ];

// // // tranEmailApi
// // //   .sendTransacEmail({
// // //     sender,
// // //     to: receivers,
// // //     subject: 'Subscribe to Cules Coding to becomeadeveloper',
// // //     message: 'this is fucking email',
// // //     textContent: `Cules Coding will teach you how to become{[params.role}}adeveloper.`,
// // //     htmlContent: `
// // //            <h1>Cules Coding</h1>
// // //           <a href="https://cules-coding. vercel.app/"> Visit </a>`,
// // //     params: {
// // //       role: 'Frontend',
// // //     },
// // //   })
// // //   .then(console.log)
// // //   .catch(console.log);

// // // const nodemailer = require('nodemailer');

// // // const sendEmail = async (option) => {
// // //   // Create Transporter
// // //   const transport = nodemailer.createTransport({
// // //     host: process.env.EMAIL_HOST,
// // //     port: process.env.EMAIL_PORT,
// // //     auth: {
// // //       user: process.env.EMAIL_USERNAME,
// // //       pass: process.env.EMAIL_PASSWORD,
// // //     },
// // //   });

// // //   //dEFINING THE EMIAL OPTION
// // //   const mailOptions = {
// // //     from: 'SardarBilal <rockeykhan142@gmail.com>',
// // //     to: option.email,
// // //     subject: option.subject,
// // //     text: option.message,
// // //   };

// // //   await transport.sendMail(mailOptions);
// // // };

// // // module.exports = sendEmail;

const nodemailer = require('nodemailer');

const sendEmail = async (option) => {
  // Create Transporter
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    // service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //dEFINING THE EMIAL OPTION
  const mailOptions = {
    from: 'SardarBilal <rockeykhan142@gmail.com>',
    to: option.email,
    subject: option.subject,
    text: option.message,
  };

  await transport.sendMail(mailOptions);
};

module.exports = sendEmail;
