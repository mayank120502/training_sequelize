const Joi = require('joi');

const email = Joi.string().custom((value) => {
  return value.trim().toLowerCase(); // Convert to lowercase
}).required();
// const phone = Joi.string().min(10).max(10).required();

let loginSchema = Joi.object({
  email,
  password: Joi.string().min(8).max(12).required()
});

loginSchema = loginSchema.or('email', 'phone');

const logoutSchema = Joi.object({
  email
});
const sendOTPSchema = Joi.object({
  email
});
const signUpSchema = Joi.object({
  name: Joi.string().min(5).max(15).required(),
  email,
  phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
  password: Joi.string().min(8).max(12).required()
});
const verifyOTPSchema = Joi.object({
  otp: Joi.string().required()
});
const forgotPasswordSchema = Joi.object({
  email,
  password: Joi.string().min(8).max(12).required()
});
const resetPasswordSchema = Joi.object({
  password: Joi.string().min(8).max(12).required(),
  newPassword: Joi.string().min(8).max(12).required(),
  reNewPassword: Joi.string().min(8).max(12).required()
});
const updateTypeSchema = Joi.object({
  type: Joi.string().required(),
  code: Joi.string().required()
});
const updateSchema = Joi.object({
  name: Joi.string().min(5).max(15),
  phone: Joi.string().pattern(/^[0-9]{10}$/)
});
module.exports = {
  loginSchema,
  logoutSchema,
  signUpSchema,
  sendOTPSchema,
  verifyOTPSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateTypeSchema,
  updateSchema
};
