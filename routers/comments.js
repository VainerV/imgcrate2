const express = require('express');
const router = express.Router();

const Comments = require('../models/comment');
const checkAuth = require('../middleware/check-auth')

router.get('/', (req, res) => {

   Comments
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
   // console.log(req.body.comment, "My new comment");
    const requiredFields = ['comment'];
   // console.log(req.body.data);
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }
   
  
   //console.log(req.body.comment, "Checking image comment");
    Comments
        .create({
            comment: req.body.comment,
            picureId: req.body.imageId,
        })
        .then(comment => res.status(201).json(comment.serialize()))
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Something went wrong' });
        });


});   //Router post

router.delete('/:id', (req,res) =>{


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



router.put('/:id', (req, res) => {
    //  console.log(req.params.id, req.body.id); ///????
      // if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
      //   res.status(400).json({
      //     error: 'Request path id and request body id values must match'
      //   });
      // }
  
      const updated = {};
      const updateableFields = ['id','comment'];
      updateableFields.forEach(field => {
        if (field in req.body) {
          updated[field] = req.body[field];
        }
      });
    
      Comments
        .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
        .then(user=> res.status(204).end())
        .catch(err => res.status(500).json({ message: 'Something went wrong' }));
    
      }); // router put


module.exports = router;

