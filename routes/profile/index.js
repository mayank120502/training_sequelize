const express = require('express');
const { userExist, checkBearer } = require('../../middlewares/auth');
const { getFollowers, getFollowing, follow } = require('../../controllers/following');

const profileRoute = express.Router();

profileRoute.get('/followers', checkBearer, userExist, getFollowers);
profileRoute.get('/following', checkBearer, userExist, getFollowing);
profileRoute.post('/follow', checkBearer, userExist, follow);

module.exports = profileRoute;
