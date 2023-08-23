const Joi = require('joi');

const postSchema = Joi.object({
    title: Joi.string().required(),
    desc: Joi.string(),
})

module.exports = {
    postSchema,
}