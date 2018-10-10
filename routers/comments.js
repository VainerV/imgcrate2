// Routers for comments

const express = require('express');
const router = express.Router();
const Pictures = require('../models/picture');
const Comments = require('../models/comment');
const checkAuth = require('../middleware/check-auth')

router.get('/', checkAuth, (req, res) => {

    Comments
        .find()
        .then(comments => {
            res.json(comments.map(comment => comment.serialize()));
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'something went terribly wrong' });
        });
    res.status(200);

}); // Router Get

router.post('/', checkAuth, (req, res) => {

    const requiredFields = ['comment'];

    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }

    Comments
        .create({
            comment: req.body.comment,
            picureId: req.body.pictureId,
            user: req.currentUser.id,
        })

        .then(comment => {

            Pictures.findOne({ _id: req.body.pictureId }, function (err, picture) {
                picture.comment.push(comment._id);
                picture.save();
                res.status(201).json(comment.serialize());
            });
        })
        .then(comment => {
           
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Something went wrong' });
        });


});   //Router post

router.delete('/:id', checkAuth, (req, res) => {


    Comments
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
    const updateableFields = ['comment'];
    updateableFields.forEach(field => {
        if (field in req.body) {
            updated[field] = req.body[field];
        }
    });

    Comments
        .findByIdAndUpdate(req.params.id, updated, { new: true })
        .then(comment => res.status(204).end())
        .catch(err => res.status(500).json({ message: 'Something went wrong' }));

}); // router put by ID


module.exports = router;

