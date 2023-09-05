const { user, post, following } = require('../model/index');
const { errorRes, successRes } = require('../services/response');
const { generateOTP, generateAuth } = require('../util/helper');
const { jwtExpiresIn, saltRounds } = require('../util/constants');
const commonService = require('../services/common');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

const loginController = async (req, res) => {
  try {
    const found = req.found;
    const { email, password } = req.body;
    const isPasswordMatch = bcrypt.compareSync(password, found.password);
    if (isPasswordMatch) {
      const payload = { id: found.id, email, type: 'login' };
      const token = generateAuth({ expiresIn: jwtExpiresIn, ...payload });
      const resData = { userName: found.name, userType: found.type, token };
      const isUpdated = await commonService.updateData(user, { email }, { token });
      if (!isUpdated[0]) {
        return res.send(errorRes(400, 'Error while updating user !'));
      }
      return res.send(successRes(200, 'Successful , login :)', resData));
    } else {
      return res.send(errorRes(404, 'Wrong Password!'));
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

const sendOTPController = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = generateOTP(6);
    const payload = { email, otp, type: 'otp' };
    const token = generateAuth({ expiresIn: jwtExpiresIn, ...payload });
    const isUpdated = await commonService.updateData(user, { email }, { token });
    if (!isUpdated[0]) {
      return res.send(errorRes(400, 'Error while updating user !'));
    }
    return res.send(successRes(200, 'Otp Send successfully', { payload, token }));
  } catch (err) {
    res.send(errorRes(500, err.message, err));
  }
};

const verifyOTPController = async (req, res) => {
  try {
    const decoded = req.decoded;
    const userInfo = req.found;
    const { otp } = req.body;
    if (decoded.type !== 'otp') {
      return res.send(errorRes(400, 'WRONG TOKEN!'));
    }
    if (decoded.otp !== otp) {
      return res.send(errorRes(400, 'Wrong otp :('));
    } else {
      const isUpdated = await commonService.updateData(user, { email: userInfo.email }, { token: null });
      if (!isUpdated[0]) {
        return res.send(errorRes(400, 'error while updating data'));
      }
      return res.send(successRes(200, 'Succesfully verified'));
    }
  } catch (err) {
    return res.send(errorRes(500, err.message, err));
  }
};

const forgotPasswordController = async (req, res) => {
  try {
    const { email, password } = req.body;
    // does user Exists middleware is providing user row information in req.found
    const found = req.found;
    const isOldPasswordSame = bcrypt.compareSync(password, found.password);
    if (isOldPasswordSame) {
      return res.send(errorRes(400, 'Cant update password which is already been used'));
    }
    const isUpdated = await commonService.updateData(user, { email }, { 'password': bcrypt.hashSync(password, saltRounds) });
    if (!isUpdated[0]) {
      return res.send(errorRes(400, 'error while updating data'));
    }
    return res.send(successRes(200, 'Password Updated Successfully.'));
  } catch (err) {
    res.send(errorRes(500, err.message, err));
  }
};

const changePasswordController = async (req, res) => {
  try {
    const decoded = req.decoded;
    const userInfo = req.found;
    if (decoded.type !== 'login') {
      return res.send(errorRes(400, 'WRONG TOKEN'));
    }
    const { password, newPassword, reNewPassword } = req.body;
    const isPasswordMatch = bcrypt.compareSync(password, userInfo.password);
    if (!isPasswordMatch) {
      return res.send(errorRes(400, 'WRONG PASSWORD CANT UPDATE YOUR PASSWORD'));
    }
    if (newPassword !== reNewPassword) {
      return res.send(errorRes(400, 'new password and re-new passwordare not same CANT UPDATE YOUR PASSWORD'));
    }
    const isOldPasswordSame = bcrypt.compareSync(newPassword, userInfo.password);
    if (isOldPasswordSame) {
      return res.send(errorRes(400, "Can't update password, as this password has been previously used."));
    }
    const isUpdated = await commonService.updateData(user, { email: userInfo.email }, { password: bcrypt.hashSync(newPassword, saltRounds) });
    if (!isUpdated[0]) {
      return res.send(errorRes(400, 'error while updating data'));
    }
    return res.send(successRes(200, 'Succesfully changed password'));
  } catch (err) {
    return res.send(errorRes(500, err.message, err));
  }
};

const getAllUser = async (req, res) => {
  try {
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const searchAttribute = req.query.searchAttribute || 'email';
    const searchValue = req.query.searchValue;
    const users = await user.findAll({
      where: {
        type: {
          [Op.ne]: '1'
        },
        [searchAttribute]: {
          [Op.like]: `%${searchValue}%`
        }
      },
      attributes: ['id', 'email', 'name', 'status', 'type'],
      offset: (page - 1) * limit,
      limit
    });
    if (!users[0]) {
      return res.send(errorRes(400, 'error while fetching users'));
    }
    return res.send(successRes(200, 'Successfully fetched details of users!', users));
  } catch (err) {
    return res.send(errorRes(500, err.message, err));
  }
};

const changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    const userInfo = await commonService.getDataOne(user, { id });
    if (status === '0') {
      return res.send(errorRes(400, `You cant set status to pending, As pending status is at initail stage only, you can VERIFY(1) this account or DISABLE(2)`));
    }
    if (!userInfo) {
      return res.send(errorRes(400, 'User does Not exists!'));
    }
    const isUpdated = await commonService.updateData(user, { id }, { status });
    if (!isUpdated[0]) {
      return res.send(errorRes(400, 'Error while updating user status!'));
    }
    return res.send(successRes(200, `Successfully updated status of User: ${userInfo.email}.`));
  } catch (err) {
    return res.send(errorRes(500, err.message, err));
  }
};

const removeUser = async (req, res) => {
  try {
    const id = req.params.id;
    const userInfo = await commonService.getDataOne(user, { id });
    if (!userInfo) {
      return res.send(errorRes(400, 'User does not exists'));
    }
    if (userInfo.type === '1') {
      return res.send(errorRes(400, 'you Cant remove an Admin from portal ! '));
    }
    const isUpdated = await user.destroy({ where: { id } });
    if (!isUpdated) {
      return res.send(errorRes(400, 'Error while Updating data!'));
    }
    return res.send(successRes(200, 'Successfully Deleted user!'));
  } catch (err) {
    return res.send(errorRes(500, err.message, err));
  }
};

const getUserDetails = async (req, res) => {
  try {
    const id = req.params.id;
    const pageFollowers = +req.query.pageFollowers || 1;
    const limitFollowers = +req.query.limitFollowers || 10;
    const pageFollowing = +req.query.pageFollowers.pageFollowing || 1;
    const limitFollowing = +req.query.limitFollowing || 10;
    const pagePost = +req.query.pagePost || 1;
    const limitPost = +req.query.limitPost || 10;
    const userInfo = await commonService.getDataOne(user, { id });
    if (!userInfo) {
      return res.send(errorRes(400, 'User does not exists!'));
    }
    const followers = await following.findAll({
      where: { followedTo: id },
      include: {
        model: user,
        as: 'followers',
        attributes: ['id', 'email', 'name']
      },
      attributes: [],
      raw: true,
      offset: (pageFollowers - 1) * limitFollowers,
      limit: limitFollowers
    });
    const followings = await following.findAll({
      where: { followedBy: id },
      include: {
        model: user,
        as: 'followingTo',
        attributes: ['id', 'email', 'name']
      },
      attributes: [],
      raw: true,
      offset: (pageFollowing - 1) * limitFollowing,
      limit: limitFollowing
    });
    const postObj = {
      where: { uploader: userInfo.email },
      attributes: ['post_id', 'title', 'desc', 'image', 'verification'],
      offset: (pagePost - 1) * limitPost,
      limit: limitPost
    };
    const posts = await post.findAll(postObj);
    const userDetails = { id: userInfo.id, name: userInfo.name, email: userInfo.email, type: userInfo.type, status: userInfo.status };
    const resData = { userDetails, followers, followings, posts };
    return res.send(successRes(200, `Successfully fetched details of user: ${userInfo.email}.`, resData));
  } catch (err) {
    return res.send(errorRes(500, err.message, err));
  }
};

module.exports = {
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
};
