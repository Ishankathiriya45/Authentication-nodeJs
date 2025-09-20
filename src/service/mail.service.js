const nodemailer = require("nodemailer");

class EmailService {
  sendMail = async (to, subject, emailData, emailClient = "nodemailer") => {
    if (emailClient == "nodemailer") {
      let transpoter = nodemailer.createTransport({
        service: process.env["EMAIL_SERVICE_" + process.env.RUN_MODE],
        auth: {
          user: process.env["EMAIL_USERNAME_" + process.env.RUN_MODE],
          pass: process.env["EMAIL_PASSWORD_" + process.env.RUN_MODE],
        },
      });

      let mailOptions = {
        from: process.env["EMAIL_USERNAME_" + process.env.RUN_MODE],
        to: to,
        subject: subject,
        text: emailData,
      };

      const otpResponse = await transpoter
        .sendMail(mailOptions)
        .then((data) => {
          console.log("Otp send successfully:", data.envelope.to);
          return data;
        })
        .catch((error) => {
          console.log("Failed to otp", error.message);
        });

      if (otpResponse) {
        return true;
      } else {
        return false;
      }
    }
  };
}
// const mailSend = async (mailData) => {
//   let transpoter = nodemailer.createTransport({
//     service: process.env["EMAIL_SERVICE_" + process.env.RUN_MODE],
//     auth: {
//       user: process.env["EMAIL_USERNAME_" + process.env.RUN_MODE],
//       pass: process.env["EMAIL_PASSWORD_" + process.env.RUN_MODE],
//     },
//   });

//   let mailOptions = {
//     from: process.env["EMAIL_USERNAME_" + process.env.RUN_MODE],
//     to: mailData.email,
//     subject: mailData.subject,
//     text: `Your otp code is ${mailData.emailData.otp}`,
//   };

//   const otpResponse = await transpoter
//     .sendMail(mailOptions)
//     .then((data) => {
//       console.log("Otp send successfully:", data.envelope.to);
//       return data;
//     })
//     .catch((error) => {
//       console.log("Failed to otp", error.message);
//     });

//   if (otpResponse) {
//     return true;
//   } else {
//     return false;
//   }
// };

module.exports = EmailService;
