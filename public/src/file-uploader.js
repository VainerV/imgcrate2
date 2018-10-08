// Uploadin Amazon S3 module

const aws = require('aws-sdk')

const { AWS_SECRET_ACCESS_KEY, AWS_ACCESS_KEY_ID, AWS_REGION } = require('../../config')

const s3 = new aws.S3({
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    accessKeyId: AWS_ACCESS_KEY_ID,
    Bucket: "imgcrate",
});


 
module.exports = s3;