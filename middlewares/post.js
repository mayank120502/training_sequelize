const jwt = require('jsonwebtoken');
const { secretKey } = require('../util/constants');

const checkBearer = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.send({
            status: 200,
            message: 'Send appropriate data in Authorization header',
        })
    }
    const token = req.headers.authorization.split(' ')[1]; 
    try {
        const decoded = jwt.verify(token, secretKey);
        req.decoded = decoded;
        next();
    } catch (err) {
        return res.status(401).send({
            status: 401,
            message: err.message,
        });
    }
}

module.exports = {
    checkBearer,
}