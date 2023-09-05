const express = require('express');
const { upload } = require('../../services/multer');
const {
  requestValidator
} = require('../../middlewares/requestValidator');

const {
  createPostController,
  viewPostController,
  editPostController,
  deleteAllController,
  deleteOnePost,
  viewOnePost,
  viewAllFollowedPosts
} = require('../../controllers/post');

const { userExist } = require('../../middlewares/auth');

const {
  checkBearer
} = require('../../middlewares/post');

const schema = require('./schema');
const postRoute = express.Router();

postRoute.post('/post', upload.single('myFile'), requestValidator(schema.postSchema), checkBearer, userExist, createPostController);
postRoute.get('/viewPost', checkBearer, viewPostController);
postRoute.patch('/editPost/:post_id', requestValidator(schema.editPostSchema), checkBearer, editPostController);
postRoute.delete('/deleteAll', checkBearer, userExist, deleteAllController);
postRoute.delete('/deleteOne/:post_id', checkBearer, userExist, deleteOnePost);
postRoute.get('/viewOne/:post_id', checkBearer, userExist, viewOnePost);
postRoute.get('/posts', checkBearer, userExist, viewAllFollowedPosts);

module.exports = postRoute;
