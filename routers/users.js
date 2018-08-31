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

    const requiredFields = ['name', 'userName', 'email'];

   
    

    console.log(req);

    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }
    console.log(req.body);
    User
        .create({
            user: {
                firstName: req.body.firstName,
                lasteName: req.body.lasteName,
            },
            // name: req.body.name,
            userName: req.body.userName,
            email: req.body.email,
        })
        .then(user => res.status(201).json(user.serialize()))
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Something went wrong' });
        });


});   //Router post









module.exports = router;