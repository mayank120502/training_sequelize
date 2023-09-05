const { errorRes } = require('../services/response');

const isAdmin = (req, res, next) => {
  try {
    if (req.found.type !== '1') {
      return res.send(errorRes(401, `You cant login to Admin's portal as you are not an ADMIN !!`));
    }
    return next();
  } catch (err) {
    return res.send(errorRes(500, err.message, err));
  }
};

module.exports = {
  isAdmin
};
