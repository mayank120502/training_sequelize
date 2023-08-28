const jwt = require('jsonwebtoken');
const { secretKey } = require('../util/constants');

const generateOTP = (length) => {
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
};

const generateAuth = (payload) => {
  try {
    const { expiresIn, ...params } = payload;
    const token = jwt.sign(params, secretKey, { expiresIn });
    return token;
  } catch (err) {
    console.log(err.mesasage);
  }
};

module.exports = {
  generateOTP,
  generateAuth,
};
