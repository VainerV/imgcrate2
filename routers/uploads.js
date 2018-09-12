const express = require('express');
const router = express.Router();
const Busboy = require('busboy');

const s3 = require('../public/src/file-uploader');
//const singleUpload = upload.single('image');

router.post('/', function (req, res) {
    const imageData = req.body.imageData;
    let busboy = new Busboy({ headers: req.headers });
    let urlData = {};
    // The file upload has completed
    busboy.on('finish', function () {
        console.log('Upload finished');
    
        // Grabs your file object from the request.
        console.log(req.files, "VAdim");
        const file = req.files.element2.data;
        
        s3.upload({
            Bucket: 'imgcrate',
            Key: 'form_submit_image.png',
            Body: file,
            ACL: 'public-read'
        }, function (err, data) {
            if (err) {
                console.log(err, "Upload failed");
            }
            urlData = data;
            console.log('Successfully uploaded package.');
        });

        console.log(file);
    });
     req.pipe(busboy);

    res.json("Function is done, file uploaded");
    console.log(urlData);
    //res.json.send(urlData);
});

module.exports = router;