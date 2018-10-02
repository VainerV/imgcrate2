
// Authentication middlewere

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
module.exports = (req, res, next) => {

    const token = req.headers.authorization;
    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        req.userData = decoded;
        next();

    } catch (error) {
        return res.status(401).json({
            message: "Auth failed token problem"
        })
    }

};