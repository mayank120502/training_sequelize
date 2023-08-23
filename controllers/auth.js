const {user , post} = require("../model/index");

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { generateOTP } = require("../util/helper");
const { secretKey , saltRounds} = require('../util/constants');
const { generateAuth , verifyAuthToken} = require('../middlewares/auth');
const commonService = require('../services/common');

const loginController = async (req, res) => {
    const { email, password } = req.body;
    const found = await commonService.getDataOne(user, { email });
    if (!found) {
        return res.send({
            status: 200,
            message: "User Not Found."
        })
    }
    if (found.status == 0) {
        return res.send({
            status: 401,
            message: "Verification Pending, Please verify your account first !",

        })
    }
    const doesPasswordMatch = bcrypt.compareSync(password , found.password);
    if (doesPasswordMatch) {
        const payload = { id: found.id, email: found.email };
        const token = generateAuth({ expiresIn: '1h', ...payload });
        const resData = {
            userName: found.name,
            userType: found.type,
            token: token,
        }
        await commonService.updateData(user, { name: found.name }, { "token": token });
        let resObj = {
            status: 200,
            message: 'Successful login.',
            resData,
        }
        res.send(resObj);
    }
    else {
        res.send({
            status: 404,
            message: " Invalid Password"
        })
    }
}

const logoutController1 = async (req , res) => {
    let bearer = req.headers['authorization'];
    let token = "";
    if(bearer){
        bearer = bearer.split(' ');
        if(bearer.length==2){
            token = bearer[1];
        }
        else{
            token = ' ';
        }
    }
    else{
        token = ' ';
    }
    jwt.verify(token , secretKey , (err , decode) =>{
        if(err){
            return res.send({
                status: 404,
                message: "Token expired",
            });
        }
        const email = decode.email;
        const emailExists = commonService.getDataOne(user , {email});
        if(!emailExists){
            return res.send({
                status: 404,
                message: "Wrong user",
                decoded,
            });
        }
        commonService.updateData(user , {email} , {token : null});
        return res.send({
            status: 200,
            message: "Successful Logout",
        });
    });
}

const logoutController = async (req, res) => {
    const { email } = req.body;
    const found = await commonService.getDataOne(user, { email });
    if (!found) {
        return res.send({
            status: 404,
            message: "User Not Found."
        });
    }
    const token = found.token;
    jwt.verify(token, secretKey, async (err, decoded) => {
        if (err) {
            return res.send({
                status: 404,
                message: "Token expired",
            });
            
        }
        else {
            if (decoded.email != email) {
                return res.send({
                    status: 404,
                    message: "Wrong user",
                    decoded,
                });
            }
            user.update({ "token": null }, {
                where: {
                    email: decoded.email,
                },
            });
            return res.send({
                status: 200,
                message: "Successful Logout",
            });
        }
    });
}

const signupController = async (req, res) => {
    const { name, email, password } = req.body;
    const found = await commonService.getDataOne(user, { email });
    if (found) {
        return res.send({
            status: 404,
            message: "Cant add new user, User already exists.",
        })
    }
    const hashedPassword = bcrypt.hashSync(password , saltRounds);
    const userData = {
        "id": uuidv4(),
        name,
        email,
        "password" : hashedPassword,
        status: 0,
    };
    await commonService.createData(user , userData);
    return res.send({
        status: 200,
        message: "Successfully Added user",
        data: userData,
    });
}

const sendOTPController = async (req, res) => {
    let reqObj = req.body;
    let otp = generateOTP(6);
    const payload = { email: reqObj.email, otp };
    const token = generateAuth({ expiresIn: '1h', ...payload });
    const updateUser = await commonService.updateData(user, { email: reqObj.email }, { token });
    if (!updateUser) {
        return res.send({
            status: 400,
            message: "Error while updating user"
        })
    }
    return res.send({
        status: 200,
        message: "successfully send OTP",
        OTP: otp,
    })
}

const verifyOTPController = async (req, res) => {
    const reqObj = req.body;
    const dataOfUser = await commonService.getDataOne(user, { email: reqObj.email })
    const token = dataOfUser.token;
    jwt.verify(token, secretKey, async (error, decoded) => {
        if (error) {
            return res.send({
                status: 404,
                message: 'Token Expired , get new OTP.',
            })
        }
        else {
            if (reqObj.otp == decoded.otp) {
                await commonService.updateData(user, { email: reqObj.email }, { token: null, status: 1 })
                return res.send({
                    status: 200,
                    message: "Successfully verify user.",
                })
            }
            else {
                return res.send({
                    status: 200,
                    message: "Wrong OTP",
                })
            }
        }
    });
}

const forgotPasswordController = async (req, res) => {
    const { email, password } = req.body;
    const found = await commonService.getDataOne(user, { email });
    if (!found) {
        return res.send({
            status: 400,
            message: "User not exist."
        })
    }
    if (found.status != 1) {
        return res.send({
            status: 401,
            message: "Please verify user First"
        })
    }
    const isOldPasswordSame = bcrypt.compareSync(password , found.password);
    if (isOldPasswordSame) {
        return res.send({
            status: 200,
            message: "Cant update password which is already been used"
        })
    }
    await commonService.updateData(user, { email }, { "password" : bcrypt.hashSync(password , saltRounds) });
    return res.send({
        status: 200,
        message: "Password Updated Successfully."
    })

}

const resetPasswordController = async(req , res) => {
    const {email , password , newPassword , reNewPassword} = req.body;
    const found = await commonService.getDataOne(user , {email});
    if(!found){
        return res.send({
            status: 200,
            message: "User Doesn't exists."
        });
    }
    if(found.status == 0){
        return res.send({
            status: 200,
            message: "Please verify the user first"
        });
    }
    if(found.status == 2){
        return res.send({
            status: 200,
            message: "User is blocked, Can't update password."
        });
    }
    let isOldPasswordSame = bcrypt.compareSync(password , found.password);
    if(!isOldPasswordSame){
        return res.send({
            status: 200,
            message: "Wrong password , Can't update old password to new."
        });
    }
    if(newPassword != reNewPassword){
        return res.send({
            status: 200,
            message: "new password and re-enter new Password are not same , Can't update password."
        });
    }
    isOldPasswordSame = bcrypt.compareSync(newPassword , found.password);
    if(isOldPasswordSame){
        return res.send({
            status: 200,
            message: "Can't update password, as this password has been previously used."
        });
    }
    commonService.updateData(user , {email} , {'password' : bcrypt.hashSync(newPassword , saltRounds)});
    return res.send({
        status: 200,
        message: "Password has been successfully updated"
    })
    
}

const updateType = async (req , res) =>{
    const {email , type , code} = req.body;
    const userInfo = await commonService.getDataOne(user, {email});
    if(!userInfo){
        return res.send({
            status : 200,
            message : "User Not Exist",
        })
    }
    if(code != 'UPDATEME'){
        return res.send({
            status : 200,
            message : "Please provide correct code",
        })
    }
    await commonService.updateData(user , {email} , {type});
    return res.send({
        status : 200,
        message : 'Successfully Update Type of User',
    })
}

module.exports = {
    loginController,
    logoutController,
    logoutController1,
    signupController,
    sendOTPController,
    verifyOTPController,
    forgotPasswordController,
    resetPasswordController,
    updateType,
}