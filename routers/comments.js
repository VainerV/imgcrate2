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

router.post('/', (req, res) => {

    const requiredFields = ['comment'];
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
   
    CommentPost
        .create({
            comment: req.body.comment,
        })
        .then(comment => res.status(201).json(comment.serialize()))
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Something went wrong' });
        });


});   //Router post

router.delete('/:id',(req,res) =>{


    CommentPost
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({ message: 'success' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });

});  // router delete user


module.exports = router;

