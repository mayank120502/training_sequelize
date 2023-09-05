const jwt = require('jsonwebtoken');
const user = require('../model/user');
const { secretKey } = require('../util/constants');
const commonService = require('../services/common');
const { errorRes } = require('../services/response');

const userExist = async (req, res, next) => {
  try {
    let email = '';
    if (req.body.email) {
      email = req.body.email;
    } else {
      email = req.decoded.email;
    }
    const data = await commonService.getDataOne(user, { email });
    if (!data) {
      return res.send(errorRes(404, 'User Does Not Exists'));
    }
    req.found = data;
    return next();
  } catch (err) {
    res.send(errorRes(500, err.message, err));
  }
};
const checkBearer = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.send({
        status: 401,
        message: 'Send appropriate data in Authorization header'
      });
    }
    const token = req.headers.authorization.split(' ')[1];

    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          status: 401,
          message: err.message
        });
      }
      req.decoded = decoded;
      return next();
    });
  } catch (err) {
    return res.send(errorRes(500, err.message, err));
  }
};

const emailPhoneExists = async (req, res, next) => {
  try {
    const emailExists = await user.findOne({ where: { email: req.body.email } });
    if (emailExists) {
      return res.send(errorRes(400, 'Email Already registered!'));
    }
    const phoneExists = await user.findOne({ where: { phone: req.body.phone } });
    if (phoneExists) {
      return res.send(errorRes(400, 'Phone number Already registered!'));
    }
    return next();
  } catch (err) {
    return res.send(errorRes(500, err.message, err));
  }
};

const isUser = (req, res, next) => {
  if (req.found.type !== '0') {
    return res.send(errorRes(400, 'Please go to your portal, You are not allowed here!'));
  }
  return next();
};

module.exports = {
  userExist,
  checkBearer,
  isUser,
  emailPhoneExists
};
