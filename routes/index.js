const express = require('express');
const authRoute = require('./auth');
const postRoute = require('./post');

const router = express.Router();
router.use('/auth' , authRoute);
router.use('/post' , postRoute);

module.exports = router;