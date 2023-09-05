const Joi = require('joi');

const email = Joi.string().custom((value) => {
  return value.trim().toLowerCase(); // Convert to lowercase
}).required();

const loginSchema = Joi.object({
  email,
  password: Joi.string().min(8).max(12).required()
});

const sendOTPSchema = Joi.object({
  email
});

const verifyOTPSchema = Joi.object({
  otp: Joi.string().custom((value) => { return value.trim(); }).required()
});

const resetPasswordSchema = Joi.object({
  password: Joi.string().min(8).max(12).required(),
  newPassword: Joi.string().min(8).max(12).required(),
  reNewPassword: Joi.string().min(8).max(12).required()
});

const updateStatusSchema = Joi.object({
  status: Joi.string().pattern(/^[012]{1}$/)
});

module.exports = {
  loginSchema,
  sendOTPSchema,
  verifyOTPSchema,
  resetPasswordSchema,
  updateStatusSchema
};
