const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
//const User =require('')
module.exports = (req, res, next) => {

   // console.log("trying to get token", req.headers.authorization); 
   const token = req.headers.authorization;
    try{
    const decoded = jwt.verify(token, JWT_SECRET) 
    req.userData = decoded;
   // console.log(req.userData)
    //req.userId = User
    next();

    } catch (error){
        return res.status(401).json({
            message: "Auth failed token problem"
        })
    }
   
};