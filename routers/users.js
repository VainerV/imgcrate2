const express = require('express');
const router = express.Router();

const User = require('../models/user');
router.get('/', (req, res) => {
   //console.log(User);
  
   User
    .find()
    .then(users => {
      res.json(users.map(user => user.serialize()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
    //console.log("user list");
    res.status(200);   /// just pepeair status not sending. Have to send something afrer to eliminate Timeout 2000 error 
    
});



    





module.exports = router;