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
        });

        console.log(file);
    });
     req.pipe(busboy);

    res.json("Function is done, file uploaded");
   
    //res.json.send(urlData);

    Picture
        .create({
           url: urlData,
           comment: req.body.comment,
        })
        .then(user => res.status(201).json(user.serialize()))
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Something went wrong' });
        });


});

module.exports = router;