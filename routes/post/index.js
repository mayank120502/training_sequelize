const express = require('express');
const {
    requestValidator,
} = require('../../middlewares/requestValidator');

const {
    createPostController ,
    viewPostController,
    editPostController,
    getAllSoftDeleted,
} = require('../../controllers/post');

const {
    checkBearer,
} =  require('../../middlewares/post');

const schema = require('./schema');
const postRoute = express.Router();

postRoute.post('/post' , requestValidator(schema.postSchema) , checkBearer , createPostController);
postRoute.get('/post' , checkBearer , viewPostController);
postRoute.patch('/post' , checkBearer , editPostController);
postRoute.get('/getSoft' , getAllSoftDeleted);

module.exports = postRoute;