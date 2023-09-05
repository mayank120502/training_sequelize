const { user, post, following } = require('../model/index');
const commonService = require('../services/common');
const { successRes, errorRes } = require('../services/response');

const createPostController = async (req, res) => {
  // assuming that req.body has actual username
  try {
    const decoded = req.decoded;
    if (!decoded) {
      return res.send(errorRes(401, "Can't upload, User is not logged in :("));
    }
    const postInfo = await post.findOne({ where: { uploader: decoded.email }, order: [['createdAt', 'DESC']] });
    if (postInfo && +postInfo.createdAt + 60000 > +Date.now()) {
      return res.send(errorRes(400, 'You have to wait for few time to create a new post!'));
    }
    const data = {
      uploader: decoded.email,
      title: req.body.title,
      desc: req.body.desc,
      image: req.file.path
    };
    const updatedData = await commonService.createData(post, data);
    return res.send(successRes(200, 'post created successfully :)', updatedData));
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

    const limit = +req.query.limit || 10;
    const offset = +req.query.offset || 0;
    if (userInfo.status === '2') {
      res.send(errorRes(403, 'USER DISABLED'));
    }
    if (userInfo.type === '0') {
      const condition = {
        'uploader': userInfo.email
      };
      const data = await commonService.getDataAll1(post, condition, ['post_id', 'title', 'desc', 'image'], limit, offset);
      if (!data) {
        return res.send(errorRes(400, 'Error while fetching posts!'));
      }
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
    const { post_id } = req.params;
    // const { title, desc, verification } = req.body;
    if (!decoded) {
      return res.send(errorRes(401, "Can't see posts , User is not logged in :("));
    }
    const postInfo = await commonService.getDataOne(post, { post_id });
    if (!postInfo) {
      return res.send(errorRes(404, 'Post does Not exists'));
    }
    if (decoded.email !== postInfo.uploader) {
      return res.send(errorRes(401, "can't update post, You have no rights to update posts by others"));
    }
    const isUpdated = await commonService.updateData(post, { post_id }, req.body);
    if (!isUpdated || !isUpdated[0]) {
      return res.send(errorRes(400, 'Error occured while updating post !'));
    }
    return res.send(successRes(200, 'Successfully updated your post'));
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
    const { post_id } = req.params;
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
    return res.send(successRes(200, `Successfully deleted(SOFT) post with postId: ${post_id}!`, isDeleted));
  } catch (err) {
    res.send(errorRes(500, err.message, err));
  }
};

const viewOnePost = async (req, res) => {
  try {
    const { post_id } = req.params;
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
    return res.send(successRes(200, `Successfully reterieved post with postId: ${post_id} .`, postInfo));
  } catch (err) {
    res.send(errorRes(500, err.message, err));
  }
};

const viewAllFollowedPosts = async (req, res) => {
  try {
    const found = req.found;
    if (found.type === '1') {
      return res.send(errorRes(400, `You are an admin, Please go to your portal!`));
    }
    const userInfo = await user.findOne({ where: { email: found.email } });
    if (!userInfo) {
      return res.send(errorRes(400, 'user not exists!'));
    }
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const offset = (page - 1) * limit;
    const posts = await post.findAll({
      attributes: ['post_id', 'title', 'desc', 'image', 'uploader'],
      where: { verification: '1' },
      include: {
        model: user,
        where: { status: '1'},
        attributes: [],
        required: true,
        include: {
          model: following,
          as: 'followingTo',
          attributes: [],
          where: {
            followedBy: userInfo.id,
          }
        }
      },
      subQuery: false,
      limit,
      offset,
      raw: true
    });
    if (!posts) {
      return res.send(errorRes(400, 'Error wile fetching posts!'));
    }
    return res.send(successRes(200, 'Successfully fetched posts of followed user!', posts));
  } catch (err) {
    res.send(errorRes(500, err.message, err));
  }
};

module.exports = {
  createPostController,
  viewPostController,
  editPostController,
  deleteAllController,
  deleteOnePost,
  viewOnePost,
  viewAllFollowedPosts
};
