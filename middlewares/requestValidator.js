const Joi = require('joi');

const requestValidator = (schema , source = 'body') => async(req , res , next) =>{
    let reqObj = req[source];
    const {error , value} = schema.validate(reqObj);
    if(error){
        return res.send({
            status: 404,
            message: error.message,
        });
    }
    next();
}

module.exports = {
    requestValidator,
};