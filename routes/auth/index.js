const express = require('express');

const {
    requestValidator,
} = require('../../middlewares/requestValidator');

const {
    loginController ,
    logoutController ,
    logoutController1 ,
    signupController,
    sendOTPController,
    verifyOTPController,
    forgotPasswordController,
    resetPasswordController,
    updateType,
} = require('../../controllers/auth');

const schema = require('./schema');

const authRoute = express.Router();
authRoute.post('/login' , requestValidator(schema.loginSchema) , loginController);
authRoute.post('/logout' , requestValidator(schema.logoutSchema) , logoutController);
// authRoute.post('/logout' , requestValidator(schema.logoutSchema) , logoutController1);
authRoute.post('/signup' , requestValidator(schema.signUpSchema) , signupController);
authRoute.post('/sendOTP' , requestValidator(schema.sendOTPSchema) ,sendOTPController);
authRoute.post('/verifyOTP' , requestValidator(schema.verifyOTPSchema) , verifyOTPController);
authRoute.post('/forgotPassword' , requestValidator(schema.forgotPasswordSchema) , forgotPasswordController);
authRoute.post('/resetPassword' , requestValidator(schema.resetPasswordSchema) , resetPasswordController);
authRoute.post('/update' , requestValidator(schema.updateTypeSchema) , updateType);

module.exports = authRoute;