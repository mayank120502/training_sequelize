const express = require('express');
const authRoute = require('./auth');
const postRoute = require('./post');
const profileRute = require('./profile');
const adminRoute = require('./admin');

const router = express.Router();
router.use('/auth', authRoute);
router.use('/post', postRoute);
router.use('/profile', profileRute);
router.use('/admin', adminRoute);

module.exports = router;
