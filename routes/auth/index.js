const express = require('express');

const {
  requestValidator
} = require('../../middlewares/requestValidator');

const { userExist, checkBearer } = require('../../middlewares/auth');

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
authRoute.patch('/login', requestValidator(schema.loginSchema), userExist, loginController);
authRoute.patch('/logout', checkBearer, userExist, logoutController);
authRoute.post('/signup', requestValidator(schema.signUpSchema), signupController);
authRoute.post('/sendOTP', requestValidator(schema.sendOTPSchema), userExist, sendOTPController);
authRoute.post('/verifyOTP', requestValidator(schema.verifyOTPSchema), checkBearer, userExist, verifyOTPController);
authRoute.post('/forgotPassword', requestValidator(schema.forgotPasswordSchema), userExist, forgotPasswordController);
authRoute.post('/resetPassword', checkBearer, requestValidator(schema.resetPasswordSchema), userExist, resetPasswordController);
authRoute.patch('/update', checkBearer, requestValidator(schema.updateTypeSchema), updateType);
authRoute.get('/getAll', getAllUsers);
authRoute.patch('/update', checkBearer, userExist, requestValidator(schema.updateSchema), updateUser);

module.exports = authRoute;
