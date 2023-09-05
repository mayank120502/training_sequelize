const jwt = require('jsonwebtoken');
const { secretKey } = require('../util/constants');

const checkBearer = (req, res, next) => {
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
    next();
  });
};

module.exports = {
  checkBearer
};
