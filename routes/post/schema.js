const Joi = require('joi');

const postSchema = Joi.object({
  title: Joi.string().required(),
  desc: Joi.string(),
});

const editPostSchema = Joi.object({
  title: Joi.string(),
  desc: Joi.string(),
  verification: Joi.string().pattern(/^[01]{1}$/)
});

module.exports = {
  postSchema,
  editPostSchema,
};
