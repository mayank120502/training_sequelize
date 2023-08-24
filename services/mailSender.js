const nodemailer = require("nodemailer");
const {
    emailForNodemailer,
    passwordForNodemailer,
} = require('../util/constants');
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: emailForNodemailer,
        pass: passwordForNodemailer,
    }
});
const mailOptions = {
    from: 'aasthabhard21@gmail.com',
    to: 'mayankjain125mj@gmail.com',
    subject: 'OTP to verify your account',
    text: 'That was easy!'
};


// transporter.sendMail(mailOptions, (err, info) => {
//     if (err) {
//         console.log('Sad', err.message);
//     }
//     else {
//         console.log(`Mail Successfully Sent to ${mailOptions.to}  :)`);
//     }
// });

module.exports = {
    transporter,
}