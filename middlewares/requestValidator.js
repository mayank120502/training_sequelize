const requestValidator = (schema, source = 'body') => async (req, res, next) => {
  const reqObj = req[source];
  const { error, value } = schema.validate(reqObj);
  if (error) {
    return res.send({
      status: 404,
      message: error.message
    });
  }
  req[source] = value;
  return next();
};

module.exports = {
  requestValidator
};
