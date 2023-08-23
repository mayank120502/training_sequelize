const express = require('express');
const {
    requestValidator,
} = require('../../middlewares/requestValidator');

const {
    createPostController ,
    viewPostController
} = require('../../controllers/post');

const {
    checkBearer,
} =  require('../../middlewares/post');

const schema = require('./schema');
const postRoute = express.Router();

postRoute.post('/post' , requestValidator(schema.postSchema) , checkBearer , createPostController);
postRoute.get('/post' , checkBearer , viewPostController);

module.exports = postRoute;