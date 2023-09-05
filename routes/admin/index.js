const express = require('express');

const adminRoute = express.Router();
const {
  requestValidator
} = require('../../middlewares/requestValidator');

const {
  isAdmin
} = require('../../middlewares/admin');

const schema = require('./schema');

const {
  loginController,
  logoutController,
  sendOTPController,
  verifyOTPController,
  changePasswordController,
  getAllUser,
  changeStatus,
  getUserDetails,
  removeUser,
  forgotPasswordController
} = require('../../controllers/admin');

const { userExist, checkBearer } = require('../../middlewares/auth');

adminRoute.patch('/login', requestValidator(schema.loginSchema), userExist, isAdmin, loginController);
adminRoute.patch('/logout', checkBearer, userExist, isAdmin, logoutController);
adminRoute.patch('/sendotp', requestValidator(schema.sendOTPSchema), userExist, isAdmin, sendOTPController);
adminRoute.patch('/verifyotp', requestValidator(schema.verifyOTPSchema), checkBearer, userExist, isAdmin, verifyOTPController);
adminRoute.patch('/changePassword', requestValidator(schema.resetPasswordSchema), checkBearer, userExist, isAdmin, changePasswordController);
adminRoute.get('/getAllUser', checkBearer, userExist, isAdmin, getAllUser);
adminRoute.patch('/updateStatus/:id', requestValidator(schema.updateStatusSchema), checkBearer, userExist, isAdmin, changeStatus);
adminRoute.patch('/removeUser/:id', checkBearer, userExist, isAdmin, removeUser);
adminRoute.get('/getUserInfo/:id', checkBearer, userExist, isAdmin, getUserDetails);
adminRoute.patch('/forgotPassword', userExist, isAdmin, forgotPasswordController);

module.exports = adminRoute;
