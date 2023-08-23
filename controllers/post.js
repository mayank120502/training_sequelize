const { user, post } = require('../model/index');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const commonService = require('../services/common');
const secretKey = require('../util/constants');
const { Op } = require('sequelize');


const createPostController = async (req, res) => {
    const decoded = req.decoded;
    if (!decoded) {
        return res.send({
            status: 200,
            message: "Can't upload, User is not logged in :(",
        })
    }
    const data = {
        post_id: uuidv4(),
        uploader : decoded.email,
        title : req.body.title,
        desc : req.body.desc,
    }
    await commonService.createData(post, data);
    return res.send({
        status: 200,
        message: 'post created successfully :)',
        data,
    });
}

const viewPostController = async (req, res) => {
    const decoded = req.decoded;
    if (!decoded) {
        return res.send({
            status: 200,
            message: "Can't see posts , User is not logged in :(",
        })
    }
    const userInfo = await commonService.getDataOne(user, { "email": decoded.email });;
    if (userInfo.type == 2) {
        res.send({
            status: 200,
            message: "USER BLOCKED",
        })
    }
    else if (userInfo.type == 0) {
        const condition = {
            [Op.or]: [{ 'uploader': userInfo.email },
            { "uploader": { [Op.ne]: userInfo.email }, verification: '1' }
            ]
        }
        const data = await commonService.getDataAll(post, condition, ['post_id', 'title']);
        return res.send({
            status: 200,
            message: "successfully view data.",
            data,
        })
    }
    else {
        const data = await commonService.getDataAll(post, {}, ['post_id', 'title']);
        return res.send({
            status: 200,
            message: "successfully view data.",
            data,
        })
    }
}

// abc

module.exports = {
    createPostController,
    viewPostController,
}