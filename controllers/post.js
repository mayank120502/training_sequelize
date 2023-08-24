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
        uploader: decoded.email,
        title: req.body.title,
        desc: req.body.desc,
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

const editPostController = async (req, res) => {
    const decoded = req.decoded;
    console.log(req.query);
    const { post_id, title, desc, verification } = req.query;
    if (!decoded) {
        return res.send({
            status: 200,
            message: "Can't see posts , User is not logged in :(",
        })
    }
    const postInfo = await commonService.getDataOne(post, { post_id });
    if (!postInfo) {
        return res.send({
            status: 200,
            message: "Post does Not exists",
        })
    }
    const userInfo = await commonService.getDataOne(user, { email: decoded.email });
    const isAdmin = userInfo.type == 1;
    if (!isAdmin) {
        if (verification) {
            return res.send({
                status: 200,
                message: "can't verify post, You are not ADMIN",
            })
        }
    }
    let message = "";
    if (isAdmin) {
        if (verification) {
            await commonService.updateData(post, { post_id }, { verification })
            message = 'Post has been approved by ADMIN.'
        }
    }
    if (postInfo.uploader == decoded.email) {
        const dataToUpdate = {};
        if (title) {
            dataToUpdate.title = title;
        }
        if (desc) {
            dataToUpdate.desc = desc;
        }
        await commonService.updateData(post, { post_id }, dataToUpdate);
    }
    else {
        if (title || desc) {
            return res.send({
                status: 200,
                message: "can't update post, You have no rights to update posts by others",
            })
        }
    }
    return res.send({
        status: 200,
        message: 'Successfully Done operations.',
    })
}

const getAllSoftDeleted = async (req , res) => {
    const decoded = req.decoded;
    // if(!decoded){
    //     return res.send({
    //         status: 200,
    //         message: "Can't view posts, User is not logged in :(",
    //     })
    // }
    // if(decoded.type != 1){
    //     return res.send({
    //         status: 200,
    //         message: "Can't view posts, you are not Admin.",
    //     })
    // }
    const data = await post.findAll({
        where: {
            verification: '2',
        },
        attributes: ['uploader' , 'title' , 'post_id'],
        order : ['uploader'],
    });
    let resData = {};
    for(let obj of data){
        if(!resData[obj.uploader]){
            resData[obj.uploader] = [];
        }
        resData[obj.uploader].push({title : obj.title , post_id : obj.post_id});
    }
    res.send({
        status : 200, 
        data : resData,
    });
}

module.exports = {
    createPostController,
    viewPostController,
    editPostController,
    getAllSoftDeleted,
}