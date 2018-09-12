const express = require('express');
const router = express.Router();
const Busboy = require('busboy');

const s3 = require('../public/src/file-uploader');
//const singleUpload = upload.single('image');

router.post('/', function (req, res) {
    const imageData = req.body.imageData;
    let busboy = new Busboy({ headers: req.headers });

    // The file upload has completed
    busboy.on('finish', function () {
        console.log('Upload finished');
        // Your files are stored in req.files. In this case,
        // you only have one and it's req.files.element2:
        // This returns:
        // {
        //    element2: {
        //      data: ...contents of the file...,
        //      name: 'Example.jpg',
        //      encoding: '7bit',
        //      mimetype: 'image/png',
        //      truncated: false,
        //      size: 959480
        //    }
        // }
        // Grabs your file object from the request.
        const file = req.files.element2.data;
        //console.log(req.files, "VAdim");
        s3.upload({
            Bucket: 'imgcrate',
            Key: 'image.png',
            Body: file,
            ACL: 'public-read'
        }, function (err, data) {
            if (err) {
                console.log(err, "ERRRRRROOOOORRR");
            }
            console.log('Successfully uploaded package.');
        });

        console.log(file);
    });
     req.pipe(busboy);






    //  singleUpload(req, res, function(err){
    //     //console.log(err, "Wating for image upload url");
    //      return res.json({'imageurl': req.file.location });
    //  });
    res.json("Function is done, file uploaded");
});

module.exports = router;