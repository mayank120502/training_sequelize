const { user, post } = require('../model/index');
const commonService = require('../services/common');
const { Op } = require('sequelize');
const { successRes, errorRes } = require('../services/response');

const createPostController = async (req, res) => {
  // assuming that req.body has actual username
  try {
    const decoded = req.decoded;
    if (!decoded) {
      return res.send(errorRes(401, "Can't upload, User is not logged in :("));
    }

    // if (decoded.email !== username) {
    //   console.log('IMPOSTOR DETECTED!!!');
    //   return res.send(errorRes(401, 'Wrong token used!'));
    // }
    const data = {
      uploader: decoded.email,
      title: req.body.title,
      desc: req.body.desc
    };
    await commonService.createData(post, data);
    return res.send(successRes(200, 'post created successfully :)', data));
  } catch (err) {
    res.send(errorRes(500, err.message, err));
  }
};

const viewPostController = async (req, res) => {
  try {
    const decoded = req.decoded;
    if (!decoded) {
      return res.send(errorRes(401, "Can't see posts , User is not logged in :("));
    }
    const userInfo = await commonService.getDataOne(user, { 'email': decoded.email });

    const limit = +req.query.limit || 100;
    const offset = +req.query.offset || 0;
    if (userInfo.type === '2') {
      res.send(errorRes(403, 'USER BLOCKED'));
    } else if (userInfo.type === '0') {
      const condition = {
        [Op.or]: [{ 'uploader': userInfo.email },
          { 'uploader': { [Op.ne]: userInfo.email }, 'verification': '1' }
        ]
      };
      const data = await commonService.getDataAll1(post, condition, ['post_id', 'title'], limit, offset);
      return res.send(successRes(200, 'Successfully view data.', data));
    } else {
      const data = await commonService.getDataAll1(post, {}, ['post_id', 'title'], limit, offset);
      return res.send(successRes(200, 'Successfully view data.', data));
    }
  } catch (err) {
    res.send(errorRes(500, err.message, err));
  }
};

const editPostController = async (req, res) => {
  // assuming that the admin can only change the status of posts
  try {
    const decoded = req.decoded;
    const { post_id, title, desc, verification } = req.query;
    if (!decoded) {
      return res.send(errorRes(401, "Can't see posts , User is not logged in :("));
    }
    const postInfo = await commonService.getDataOne(post, { post_id });
    if (!postInfo) {
      return res.send(errorRes(404, 'Post does Not exists'));
    }
    const userInfo = await commonService.getDataOne(user, { email: decoded.email });
    const isAdmin = userInfo.type === '1';
    if (!isAdmin) {
      if (verification) {
        return res.send(errorRes(401, "can't verify post, You are not ADMIN"));
      }
    }
    if (isAdmin) {
      if (verification) {
        await commonService.updateData(post, { post_id }, { verification });
        return res.send(successRes(200, 'Successfully verified post.'));
      }
    }
    if (postInfo.uploader === decoded.email) {
      const dataToUpdate = {};
      if (title) {
        dataToUpdate.title = title;
      }
      if (desc) {
        dataToUpdate.desc = desc;
      }
      await commonService.updateData(post, { post_id }, dataToUpdate);
      return res.send(successRes(200, 'Successfully updated your post'));
    } else {
      if (title || desc) {
        return res.send(errorRes(401, "can't update post, You have no rights to update posts by others"));
      }
    }
  } catch (err) {
    res.send(errorRes(500, err.message, err));
  }
};

const getAllSoftDeleted = async (req, res) => {
  try {
    const decoded = req.decoded;
    const isAdmin = (await commonService.getDataOne(user, { email: decoded.email })).type === '1';
    if (!isAdmin) {
      return res.send(errorRes(401, 'Unauthorised user.'));
    }
    let { limit, offset } = req.query;
    limit = +limit;
    offset = +offset;
    const conditions = [
      { verification: '2' }, ['uploader', 'title', 'post_id', 'updatedAt'], limit, offset, [['updatedAt', 'DESC']]
    ];
    const data1 = await commonService.getDataAll1(post, ...conditions);
    const resData = {};
    for (const obj of data1) {
      if (!resData[obj.uploader]) {
        resData[obj.uploader] = [];
      }
      resData[obj.uploader].push({ title: obj.title, post_id: obj.post_id, updatedAt: obj.updatedAt });
    }
    res.send(200, 'Successfully get soft deleted posts', resData);
  } catch (err) {
    res.send(errorRes(500, err.message, err));
  }
};

const viewAllPosts = async (req, res) => {
  try {
    const limit = req.query.limit || 100;
    const offset = req.query.offset || 0;
    console.log(typeof limit);
    // only verified post can be viewed , so verification status should be 1
    const obj = {
      where: { verification: '0' },
      attributes: ['uploader', 'title', 'post_id', 'updatedAt'],
      limit,
      offset
    };
    const data = await post.findAll(obj);
    if (!data) {
      return res.send(errorRes(404, 'The requested resource was not found.'));
    }
    res.send(successRes(200, 'Successfully, retrieved Data of all users.', data));
  } catch (err) {
    res.send(errorRes(500, err.message, err));
  }
};

const deleteAllController = async (req, res) => {
  try {
    const uploader = req.decoded.email;
    const deleted = await post.destroy({ where: { uploader } });
    if (!deleted) {
      return res.send(errorRes(401, 'error while deleting posts'));
    }
    return res.send(successRes(200, 'Successfully deleted posts!', deleted));
  } catch (err) {
    res.send(errorRes(500, err.message, err));
  }
};

const deleteOnePost = async (req, res) => {
  try {
    const { post_id } = req.body;
    const decoded = req.decoded;
    if (!decoded) {
      return res.send(errorRes(401, "Can't see posts , User is not logged in :("));
    }
    const postInfo = await commonService.getDataOne(post, { post_id });
    if (!postInfo) {
      return res.send(errorRes(404, 'Post does not exists'));
    }
    if (postInfo.uploader !== decoded.email) {
      return res.send(errorRes(401, "can't delete post, You have no rights to delete posts by others"));
    }
    const isDeleted = await post.destroy({ where: { post_id } });
    if (!isDeleted) {
      return res.send(errorRes(401, 'Error while deleting posts'));
    }
    return res.send(successRes(200, `Successfully deleted post with postId: ${post_id}!`, isDeleted));
  } catch (err) {
    res.send(errorRes(500, err.message, err));
  }
};

module.exports = {
  createPostController,
  viewPostController,
  editPostController,
  getAllSoftDeleted,
  viewAllPosts,
  deleteAllController,
  deleteOnePost
};
