const Joi = require('joi');

let loginSchema = Joi.object({
    email : Joi.string(),
    phone : Joi.string(),
    password : Joi.string().min(8).max(12).required(),
});

loginSchema = loginSchema.or('email' , 'phone');

const logoutSchema = Joi.object({
    email : Joi.string().required(),
});
const sendOTPSchema = Joi.object({
    email : Joi.string().required(),
});
const signUpSchema = Joi.object({
    name : Joi.string().min(5).max(15).required(),
    email : Joi.string().required(),
    phone : Joi.string().required(),
    password : Joi.string().min(8).max(12).required(),
});
const verifyOTPSchema = Joi.object({
    otp : Joi.string().required(),
    email : Joi.string().required(),
});
const forgotPasswordSchema = Joi.object({
    email : Joi.string().required(),
    password : Joi.string().min(8).max(12).required()
});
const resetPasswordSchema = Joi.object({
    email: Joi.string().required(),
    password : Joi.string().min(8).max(12).required(),
    newPassword : Joi.string().min(8).max(12).required(),
    reNewPassword : Joi.string().min(8).max(12).required(),
})
const updateTypeSchema = Joi.object({
    email : Joi.string().required(),
    type : Joi.string().required(),
    code : Joi.string().required(),
    
})
module.exports = {
    loginSchema,
    logoutSchema,
    signUpSchema,
    sendOTPSchema,
    verifyOTPSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    updateTypeSchema,
}