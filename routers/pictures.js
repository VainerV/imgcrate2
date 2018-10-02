const express = require('express');
const router = express.Router();
const Busboy = require('busboy');
const Picture = require('../models/picture')
const s3 = require('../public/src/file-uploader');
const checkAuth = require('../middleware/check-auth');
const User = require('../models/user');


router.post('/', checkAuth, function (req, res) {
    const imageData = req.body.imageData;
    console.log("Picture router,  line 10", req.files);
    let busboy = new Busboy({ headers: req.headers });
    let urlData = {};
    // The file upload has completed
    busboy.on('finish', function () {
        console.log('Upload finished');

        // Grabs your file object from the request.
        //console.log(req.files, "VAdim");
        const file = req.files.image.data;

        s3.upload({
            Bucket: 'imgcrate',
            Key: Date.now() + (req.files.image.name),  /// <=== must find real file name.
            // Key: 'form_submit_image.png',
            Body: file,
            ACL: 'public-read'
        }, function (err, data) {
            if (err) {
                console.log(err, "Upload failed");
            }
            urlData = data;
           console.log('Successfully uploaded package.', data.Location);
          //  console.log('Successfully uploaded package.', req.body);
// find user by id and pass it to Picture
           console.log(req.body);
           
           
            Picture
                .create({
                    url: data.Location,
                    description: req.body.comment,
                    user: req.userData.id,
                })
                .then(picture => res.status(201).json(picture.serialize()))
                .catch(err => {
                    console.error(err);
                    res.status(500).json({ error: 'Something went wrong' });
                });
        });

        console.log(file);
    });



    req.pipe(busboy);



    res.json("Function is done, file uploaded");

    //res.json.send(urlData);




});


router.delete('/:id',checkAuth, (req, res) => {


    Picture
        .findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(204).json({ message: 'success' });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'something went terribly wrong' });
        });

});  // router delete pic ctom DB



router.get('/', checkAuth, (req, res) => {
    Picture
        .find()
        .then(pictures => {
            res.json(pictures.map(picture => picture.serialize()));
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'something went terribly wrong' });
        });

    res.status(200);
    
    console.log(res.body);
    // Need to retreve urls of th pics 
    // and add them to HTML

}); // Router Get


router.get('/:id', checkAuth, (req, res) => {
        
        Picture
            .findById(req.params.id)
            .then((picture) => {
                res.status(200).json(picture.serialize());
                //console.log(picture);
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ error: 'something went terribly wrong' });
            });
    
   

}); // Router Get by ID



module.exports = router;