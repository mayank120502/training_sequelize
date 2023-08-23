// const { secretKey } = require("../util/constants");
// const jwt = require('jsonwebtoken');
const Op = require('sequelize');

exports.updateData = async (model, condition, data)=>{
    const updateUser = await model.update(data, {
        where: condition
    });

    return updateUser ? updateUser : false;
}

exports.getDataOne = async (model , condition) =>{
    const getData = await model.findOne({
        where : condition,
        plain : true
    })
    return getData;
}

// exports.getDataAll = async(model , attributes) => {
//     const getdata = await model.findAll({
//         attributes,
//     });
//     return getdata;
// }

exports.getDataAll = async(model , condition , attributes) =>{
    console.log(condition);
    const getData = await model.findAll({
        where : condition,
        attributes,
    })
    return getData;
}


exports.getList = async (model, condition, attributes, limit, offset, order) => {
    try {
        let list = await model.findAndCountAll({
            ...condition !== undefined && {
                where: condition
            },
            ...attributes !== undefined && {
                attributes
            },
            ...limit !== undefined && {
                limit
            },
            ...offset !== undefined && {
                offset
            },
            ...order !== undefined && {
                order
            },

        });
        return list ? JSON.parse(JSON.stringify(list)) : false;

    } catch (error) {
        console.log(err);
        return false
    }
}






exports.createData = async(model , data) =>{
    const createData = await model.create(data);
}
