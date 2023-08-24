const { accountSid , authToken , sendersPhone} = require('../util/constants');

const client = require('twilio')(accountSid , authToken);

const sendSMS = (to , body) => {
    let obj = {
        from:sendersPhone,
        to,
        body,
    };
    client.messages.create(obj);
}

module.exports = {
    sendSMS,
}