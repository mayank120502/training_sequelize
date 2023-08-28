// const { secretKey } = require("../util/constants");
// const jwt = require('jsonwebtoken');

exports.updateData = async (model, condition, data) => {
  const updateUser = await model.update(data, {
    where: condition
  });

  return updateUser || false;
};

exports.getDataOne = async (model, condition) => {
  const getData = await model.findOne({
    where: condition,
    plain: true
  });
  return getData;
};

exports.getDataAll = async (model, condition, attributes) => {
  const getData = await model.findAll({
    where: condition,
    attributes
  });
  return getData;
};

exports.getDataAll1 = async (model, condition, attributes, limit = 100, offset = 0, order) => {
  try {
    const obj = {};
    if (typeof condition === 'object') {
      obj.where = condition;
    }
    if (typeof attributes === 'object') {
      obj.attributes = attributes;
    }
    if (typeof limit === 'number') {
      obj.limit = limit;
    }
    if (typeof offset === 'number') {
      obj.offset = offset;
    }
    if (typeof order === 'object') {
      obj.order = order;
    }
    const getData = await model.findAll(obj);
    return getData;
  } catch (err) {
    console.log(err.message);
  }
};

exports.createData = async (model, data) => {
  try {
    const created = await model.create(data);
    return created ? JSON.parse(JSON.stringify(created)) : false;
    // return created || false;
  } catch {
    return false;
  }
};
