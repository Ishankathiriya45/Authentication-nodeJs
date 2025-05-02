const nodemailer = require('nodemailer')

const mailForgot = async (mailData) => {
    let transpoter = nodemailer.createTransport({
        service: process.env['EMAIL_SERVICE_' + process.env.RUN_MODE],
        auth: {
            user: process.env['EMAIL_USERNAME_' + process.env.RUN_MODE],
            pass: process.env['EMAIL_PASSWORD_' + process.env.RUN_MODE],
        }
    })

    let mailOptions = {
        from: process.env['EMAIL_USERNAME_' + process.env.RUN_MODE],
        to: mailData.email,
        subject: mailData.subject,
        text: `forgot-password token::${mailData.token}`
    }

    const otpResponse = await transpoter.sendMail(mailOptions).then((data) => {
        console.log('Your password forgotted:', data.envelope.to)
        return data;
    }).catch((error) => {
        console.log('Failed', error.message)
    })

    if (otpResponse) {
        return true;
    } else {
        return false;
    }
}

module.exports = {
    mailForgot,
}