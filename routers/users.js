const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = require('../config');
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

router.delete('/:id', (req, res) => {


    User
        .findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(204).json({ message: 'success' });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'something went terribly wrong' });
        });

});  // router delete user


router.put('/:id', (req, res) => {
    //  console.log(req.params.id, req.body.id); ///????
    // if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    //   res.status(400).json({
    //     error: 'Request path id and request body id values must match'
    //   });
    // }

    const updated = {};
    const updateableFields = ['id', 'user', 'userName', 'email'];
    updateableFields.forEach(field => {
        if (field in req.body) {
            updated[field] = req.body[field];
        }
    });

    User
        .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
        .then(user => res.status(204).end())
        .catch(err => res.status(500).json({ message: 'Something went wrong' }));

}); // router put


////////////////////////////////////


router.post('/signup', (req, res) => {

    const requiredFields = ['user', 'userName', 'email', 'password'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }

    bcrypt.hash(req.body.password, 10, (err, hash) => {
        User.find({ email: req.body.email })
            .exec()
            .then(user => {
                if (user.length >= 1) {
                    return res.status(409).json({
                        message: 'Email aleady exists'
                    })
                }
                else {


                    if (err) {

                        return res.status(500).json({
                            error: err
                        })
                    }

                    else {

                        User
                            .create({
                                user: req.body.user,
                                userName: req.body.userName,
                                email: req.body.email,
                                password: hash
                            })
                            .then(user => res.status(201).json(user.serialize()))
                            .catch(err => {
                                console.error(err);
                                res.status(500).json({ error: 'Something went wrong' });
                            });

                    }

                }
            })


    })



});   //Router  post sign up


router.post('/login', (req, res) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({ // 401- not authorized
                    message: "Auth failed"
                })
            }

            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({ // 401- not authorized
                        message: "Auth failed"
                    })
                }
                if (result) {
                    const token = jwt.sign({
                        email: user[0].email,
                        id: user[0]._id
                    },
                        JWT_SECRET,
                        {
                            expiresIn: "1h"
                        });

                    return res.status(200).json({
                        message: "Auth Succesful",
                        token: token
                    })
                }
                res.status(401).json({
                    message: 'Auth failed'
                })
            })

        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Something went wrong' });
        }) // router for users loging 

})


module.exports = router;