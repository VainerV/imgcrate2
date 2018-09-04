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

});  // router delete user


router.put('/:id', (req, res) => {
  //  console.log(req.params.id, req.body.id); ///????
    // if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    //   res.status(400).json({
    //     error: 'Request path id and request body id values must match'
    //   });
    // }

    const updated = {};
    const updateableFields = ['id','user', 'userName', 'email'];
    updateableFields.forEach(field => {
      if (field in req.body) {
        updated[field] = req.body[field];
      }
    });
  
    User
      .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
      .then(user=> res.status(204).end())
      .catch(err => res.status(500).json({ message: 'Something went wrong' }));
  
    }); // router put







module.exports = router;