const express = require('express');
const router = express.Router();

const CommentPost = require('../models/commentpost');


router.get('/', (req, res) => {

   CommentPost
        .find()
        .then(comments => {
            res.json(comments.map(comment => comment.serialize()));
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'something went terribly wrong' });
        });
    //console.log("user list");
    res.status(200);   /// just pepeair status not sending. Have to send something afrer to eliminate Timeout 2000 error 

}); // Router Get

module.exports = router;

