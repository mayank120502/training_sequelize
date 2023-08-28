const express = require('express');
const {
  requestValidator
} = require('../../middlewares/requestValidator');

const {
  createPostController,
  viewPostController,
  editPostController,
  getAllSoftDeleted,
  viewAllPosts,
  deleteAllController,
  deleteOnePost
} = require('../../controllers/post');

const { userExist } = require('../../middlewares/auth');

const {
  checkBearer
} = require('../../middlewares/post');

const schema = require('./schema');
const postRoute = express.Router();

postRoute.post(
  '/post',
  requestValidator(schema.postSchema),
  checkBearer,
  userExist,
  createPostController
);

postRoute.get('/viewPost', checkBearer, viewPostController);
postRoute.patch('/editPost', checkBearer, editPostController);
postRoute.get('/getSoft', checkBearer, getAllSoftDeleted);
postRoute.get('/viewAllPosts', viewAllPosts);
postRoute.delete('/deleteAll', checkBearer, userExist, deleteAllController);
postRoute.delete('/deleteOne',
  checkBearer,
  userExist,
  deleteOnePost);

module.exports = postRoute;
