require('dotenv').config()

// const secretKey = '1234';
const saltRounds = 10;
// const emailForNodemailer = 'aasthabhard21@gmail.com';
// const passwordForNodemailer = 'axsfhlbvyidvfjmj';

const secretKey = process.env.SECRET_KEY;
// const saltRounds = process.env.SALTROUNDS;
const emailForNodemailer = process.env.EMAIL_NM;
const passwordForNodemailer = process.env.PASSWORD_NM;
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const sendersPhone = process.env.SENDER_PHONE;


module.exports = {
    secretKey,
    saltRounds,
    emailForNodemailer,
    passwordForNodemailer,
    accountSid,
    authToken,
    sendersPhone
}