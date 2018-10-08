// Users routers

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = require('../config');
const checkAuth = require('../middleware/check-auth')

router.get('/', checkAuth, (req, res) => {
    User
        .find()
        .then(users => {
            res.json(users.map(user => user.serialize()));
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'something went terribly wrong' });
        });
    res.status(200);

}); // Router Get

router.post('/', checkAuth, (req, res) => {

    const requiredFields = ['user', 'userName', 'email'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }

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

router.delete('/:id', checkAuth, (req, res) => {


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


router.put('/:id', checkAuth, (req, res) => {
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
                    message: "Auth failed email not exist"
                })
            }

            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({ // 401- not authorized
                        message: "Auth failed email or password incorrect"
                    })
                }
                if (result) {
                    const token = jwt.sign({
                        email: user[0].email,
                        id: user[0]._id
                    },
                        JWT_SECRET,
                        {
                            expiresIn: "3h"
                        });

                    return res.status(200).json({
                        userEmail: user[0].email,
                        message: "Auth Succesful",
                        token: token

                    })

                }
                res.status(401).json({
                    message: 'Auth failed Bcrypt failed'
                })
            })

        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Something went wrong' });
        }) // router for users loging 

})


module.exports = router;