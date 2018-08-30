const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel.js');
router.get('/', (req, res) => {

    //console.log("user list");
    res.status(200);   /// just pepeair status not sending. Have to send something afrer to eliminate Timeout 2000 error 
    res.json([{ "user": { "firstName": "Alex", "lastName": "Johns" } }]);
   
})




module.exports = router;