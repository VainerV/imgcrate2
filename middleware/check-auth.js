const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

module.exports = (req, res, next) => {
    const token = req.headers.authorization;
    console.log("trying to get token", token);
    try{
    const decoded = jwt.verify(req.body.token, JWT_SECRET) 
    req.userData = decoded;
    console.log(req.userData)
    next();

    } catch (error){
        return res.status(401).json({
            message: "Auth failed token problem"
        })
    }
   
};