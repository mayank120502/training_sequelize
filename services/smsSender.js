const { accountSid, authToken, sendersPhone } = require('../util/constants');

const client = require('twilio')(accountSid, authToken);

const sendSMS = async (to, body) => {
  const obj = {
    from: sendersPhone,
    to,
    body
  };
  try {
    await client.messages.create(obj);
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = {
  sendSMS
};
