const express = require('express');

const {
  requestValidator
} = require('../../middlewares/requestValidator');

const { userExist, checkBearer, isUser, emailPhoneExists } = require('../../middlewares/auth');

const {
  loginController,
  logoutController,
  signupController,
  sendOTPController,
  verifyOTPController,
  forgotPasswordController,
  resetPasswordController,
  updateType,
  getAllUsers,
  updateUser
} = require('../../controllers/auth');

const schema = require('./schema');

const authRoute = express.Router();
authRoute.patch('/login', requestValidator(schema.loginSchema), userExist, isUser, loginController);
authRoute.patch('/logout', checkBearer, userExist, isUser, logoutController);
authRoute.post('/signup', requestValidator(schema.signUpSchema), emailPhoneExists, signupController);
authRoute.patch('/sendOTP', requestValidator(schema.sendOTPSchema), userExist, isUser, sendOTPController);
authRoute.patch('/verifyOTP', requestValidator(schema.verifyOTPSchema), checkBearer, userExist, isUser, verifyOTPController);
authRoute.patch('/forgotPassword', requestValidator(schema.forgotPasswordSchema), userExist, isUser, forgotPasswordController);
authRoute.patch('/resetPassword', checkBearer, requestValidator(schema.resetPasswordSchema), userExist, isUser, resetPasswordController);
authRoute.patch('/updateType', checkBearer, requestValidator(schema.updateTypeSchema), updateType); // this is for updating user type ie. admin or user
authRoute.get('/getAll', getAllUsers); // without login
authRoute.patch('/updateUser', checkBearer, userExist, isUser, requestValidator(schema.updateSchema), updateUser);

module.exports = authRoute;
