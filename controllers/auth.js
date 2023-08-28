const { user } = require('../model/index');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { generateOTP, generateAuth } = require('../util/helper');
const { saltRounds, jwtExpiresIn } = require('../util/constants');
const commonService = require('../services/common');
const { transporter } = require('../services/mailSender');
const { sendSMS } = require('../services/smsSender');
const { errorRes, successRes } = require('../services/response');

const loginController = async (req, res) => {
  try {
    const { password } = req.body;
    // does user Exists middleware is providing user row information in req.body
    const found = req.found;
    if (found.status === '0') {
      return res.send(errorRes(401, 'Verification Pending, Please verify your account first !'));
    }
    const doesPasswordMatch = bcrypt.compareSync(password, found.password);
    if (doesPasswordMatch) {
      const payload = { id: found.id, email: found.email, type: 'login' };
      const token = generateAuth({ expiresIn: jwtExpiresIn, ...payload });
      const resData = { userName: found.name, userType: found.type, token };
      await commonService.updateData(user, { name: found.name }, { token });
      return res.send(successRes(200, 'Successful , login :)', resData));
    } else {
      res.send(errorRes(404, 'Wrong Password'));
    }
  } catch (err) {
    res.send(errorRes(500, err.message, err));
  }
};

const logoutController = async (req, res) => {
  try {
    if (req.decoded.type === 'otp') {
      return res.send(errorRes(400, 'wrong token!'));
    }
    // check bearer token middleware is providing user token decoded information in request.decoded
    const email = req.decoded.email;
    // updating user by token = null
    const updateUser = commonService.updateData(user, { email }, { token: null });
    if (!updateUser) {
      return res.send(errorRes(400, 'Error while updating user !'));
    }
    return res.send(successRes(200, 'Successfully logout user!'));
  } catch (err) {
    res.send(errorRes(500, err.message, err));
  }
};

const signupController = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const found = await commonService.getDataOne(user, { email });
    if (found) {
      return res.send(errorRes(409, 'User already exists'));
    }
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    const userData = {
      'id': uuidv4(),
      name,
      email,
      phone,
      'password': hashedPassword,
      'status': 0
    };
    const updateUser = await commonService.createData(user, userData);
    if (!updateUser) {
      return res.send(errorRes(400, 'Error while updating user !'));
    }
    delete updateUser.password;
    return res.send(successRes(200, 'Successfully Added user', updateUser));
  } catch (err) {
    return res.send(errorRes(500, err.message, err));
  }
};

const sendOTPController = async (req, res) => {
  try {
    const reqObj = req.body;
    const otp = generateOTP(6);
    const payload = { email: reqObj.email, otp, type: 'otp' };
    const token = generateAuth({ expiresIn: jwtExpiresIn, ...payload });
    const updateUser = await commonService.updateData(user, { email: reqObj.email }, { token });
    // does user Exists middleware is providing user row information in req.found
    const userInfo = req.found;
    if (!updateUser) {
      return res.send(errorRes(401, 'Error while Updating Data'));
    }
    const mailOptions = {
      to: reqObj.email,
      subject: 'OTP for verification',
      text: `Hey user the OTP for verification is ${otp}.`
    };
    try {
      await transporter.sendMail(mailOptions);
    } catch (err) {
      console.log(err.mesasge);
    }
    try {
      await sendSMS('+91' + userInfo.phone, `Hey user your OTP for verification is : ${otp}`);
    } catch (err) {
      console.log(err.mesasge);
    }
    return res.send(successRes(200, 'successfully send OTP', { otp, token }));
  } catch (err) {
    res.send(errorRes(500, err.message, err));
  }
};

const verifyOTPController = async (req, res) => {
  try {
    if (req.decoded.type === 'login') {
      return res.send(errorRes(400, 'wrong token!'));
    }
    const reqObj = req.body;
    // does user Exists middleware is providing user row information in req.found
    // verify jwt middleware is providing user row information in req.decoded
    const dataOfUser = req.found;
    const decoded = req.decoded;
    if (reqObj.otp === decoded.otp) {
      const isUpdated = await commonService.updateData(user, { email: dataOfUser.email }, { token: null, status: 1 });
      if (!isUpdated) {
        return res.send(errorRes(400, 'error while updating data'));
      }
      return res.send(successRes(200, 'Succesfully verified user'));
    } else {
      return res.send(errorRes(401, 'Wrong OTP'));
    }
    // const token = dataOfUser.token;
    // jwt.verify(token, secretKey, async (error, decoded) => {
    //   if (error) {
    //     return res.send(errorRes(404, 'Token Expired, get new OTP.'));
    //   } else {
    //     const mailOptions = {
    //       to: dataOfUser.email,
    //       subject: 'Status of your verification'
    //     };
    //     if (reqObj.otp === dataOfUser.otp) {
    //       // if (reqObj.otp === decoded.otp) {
    //       await commonService.updateData(user, { email: dataOfUser.email }, { token: null, status: 1 });
    //       mailOptions.text = 'Congrats! You are a verified user now.';
    //       transporter.sendMail(mailOptions);
    //       return res.send(successRes(200, 'Succesfully verified user'));
    //     } else {
    //       mailOptions.text = "Wrong otp, can't proceed your verification process.";
    //       transporter.sendMail(mailOptions);
    //       return res.send(errorRes(401, 'Wrong OTP'));
    //     }
    //   }
    // });
  } catch (err) {
    res.send(errorRes(500, err.message, err));
  }
};

const forgotPasswordController = async (req, res) => {
  try {
    const { email, password } = req.body;
    // does user Exists middleware is providing user row information in req.found
    const found = req.found;
    if (found.status !== '1') {
      return res.send(errorRes(401, 'Please verify user First'));
    }
    const isOldPasswordSame = bcrypt.compareSync(password, found.password);
    if (isOldPasswordSame) {
      return res.send(errorRes(400, 'Cant update password which is already been used'));
    }
    await commonService.updateData(user, { email }, { 'password': bcrypt.hashSync(password, saltRounds) });
    return res.send(successRes(200, 'Password Updated Successfully.'));
  } catch (err) {
    res.send(errorRes(500, err.message, err));
  }
};

const resetPasswordController = async (req, res) => {
  try {
    const { email, newPassword, reNewPassword } = req.body;
    // check bearer token middleware is providing user token decoded information in request.decoded
    if (req.decoded.email !== email) {
      return res.send(errorRes(401, 'Different token and different user ;( '));
    }
    // does user Exists middleware is providing user row information in req.found
    const found = req.found;
    if (found.status === '0') {
      return res.send(errorRes(401, 'Unauthorised User'));
    }
    if (found.status === '2') {
      return res.send(errorRes(403, 'Blocked User'));
    }
    if (newPassword !== reNewPassword) {
      return res.send(errorRes(400, "new password and re-enter new Password are not same , Can't update password."));
    }
    const isOldPasswordSame = bcrypt.compareSync(newPassword, found.password);
    if (isOldPasswordSame) {
      return res.send(errorRes(400, "Can't update password, as this password has been previously used."));
    }
    await commonService.updateData(user, { email }, { 'password': bcrypt.hashSync(newPassword, saltRounds) });
    return res.send(successRes(200, 'Password has been successfully updated'));
  } catch (err) {
    res.send(errorRes(500, err.message, err));
  }
};

const updateType = async (req, res) => {
  try {
    if (req.decoded.type === 'otp') {
      return res.send(errorRes(400, 'wrong token!'));
    }
    const { type, code } = req.body;
    if (code !== 'UPDATEME') {
      return res.send(errorRes(400, 'Please provide correct code'));
    }
    // does user Exists middleware is providing user row information in req.found
    const email = req.decoded.email;
    const typeUpdated = await commonService.updateData(user, { email }, { type });
    if (!typeUpdated) {
      return res.send(errorRes(400, 'Error while updating data'));
    }
    return res.send(successRes(200, 'Successfully Update Type of User'));
  } catch (err) {
    res.send(errorRes(500, err.message, err));
  }
};

const getAllUsers = async (req, res) => {
  try {
    const data = await commonService.getDataAll1(user);
    if (!data) {
      return res.send(errorRes(400, 'Error while updating data'));
    }
    return res.send(successRes(200, 'Successfully reterived data', data));
  } catch (err) {
    res.send(errorRes(500, err.message, err));
  }
};

const updateUser = async (req, res) => {
  try {
    if (req.decoded.type === 'otp') {
      return res.send(errorRes(400, 'wrong token!'));
    }
    const found = req.decoded;
    const conditions = req.body;
    const isUpdated = await commonService.updateData(user, { 'email': found.email }, conditions);
    if (!isUpdated || isUpdated[0] === 0) {
      return res.send(errorRes(400, 'Error while updating data'));
    }
    return res.send(successRes(200, 'Successfully updated data', isUpdated));
  } catch (err) {
    res.send(errorRes(500, err.message, err));
  }
};

module.exports = {
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
};
