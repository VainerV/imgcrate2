
// Authentication middlewere
const User = require('../models/user')
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
module.exports = (req, res, next) => {
    let userId = 0;
    const token = req.headers.authorization;
    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        req.userData = decoded;
        userId = decoded.id;
        User.findById(userId)
          .exec()
          .then(user => {
              req.currentUser = user;
              next();
          })
       
        

    } catch (error) {
        return res.status(401).json({
            message: "Auth failed token problem"
        })
    }

};