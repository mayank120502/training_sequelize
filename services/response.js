const errorRes = (status, message, error = {}) => {
  return {
    success: false,
    status,
    message,
    error
  };
};
const successRes = (status, message, data = {}) => {
  return {
    success: true,
    status,
    message,
    data
  };
};

module.exports = {
  errorRes,
  successRes
};
