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

module.exports = {
  userExist,
  checkBearer
};
