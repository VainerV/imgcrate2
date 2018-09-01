const express = require('express');
const router = express.Router();


const User = require('../models/user');

router.get('/', (req, res) => {

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

}); // Router Get

router.post('/', (req, res) => {

    const requiredFields = ['user', 'userName', 'email'];
  // console.log(req.body);
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }
   // console.log("REQ>BODYt", req.body);
   
    User
        .create({
            user: req.body.user,
            userName: req.body.userName,
            email: req.body.email,
        })
        .then(user => res.status(201).json(user.serialize()))
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Something went wrong' });
        });


});   //Router post

router.delete('/:id',(req,res) =>{


    User
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({ message: 'success' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });

});







module.exports = router;