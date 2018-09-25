const express = require('express');
const router = express.Router();
const Busboy = require('busboy');
const Picture = require('../models/picture')
const s3 = require('../public/src/file-uploader');
//const singleUpload = upload.single('image');

router.post('/', function (req, res) {
    const imageData = req.body.imageData;
    console.log(req.files);
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
            Picture
                .create({
                    url: data.Location,
                    comment: req.body.comment,
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


router.delete('/:id', (req, res) => {


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



router.get('/', (req, res) => {
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


router.get('/:id', (req, res) => {
        
        Picture
            .findById(req.params.id)
            .then((picture) => {
                
                res.status(200).json(picture.serialize());
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ error: 'something went terribly wrong' });
            });
    
   

}); // Router Get by ID



module.exports = router;