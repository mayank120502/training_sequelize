const jwt = require('jsonwebtoken');
const user = require('../model/user');
const {secretKey} = require('../util/constants');

const generateAuth = (payload) => {
    const{expiresIn , ...params} = payload;
    const token = jwt.sign(params , secretKey , {expiresIn});
    return token;
}

const verifyAuthToken = (req , res , next) => {
    let token = req.header('authorization');
    if(!token){
        return res.send({
            status : 401,
            mesasage : 'Token is required',
        })
    }
    token = token.split(' ')[1];
    console.log(token);
    jwt.verify(token , secretKey , function(error , decode){
        if(error){
            return res.send({
                status : 400,
                mesasage : 'Invalid Token.',
            })
        }
        req.data = decode;
        next();
    });

}


module.exports = {
    generateAuth,
    verifyAuthToken,
}