const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
const { AWS_SECRET_ACCESS_KEY, AWS_ACCESS_KEY_ID, AWS_REGION } = require('../../config')

aws.config.update({
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    accessKeyId: AWS_ACCESS_KEY_ID,
    region: AWS_REGION,
})
const s3 = new aws.S3();


 
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'some-bucket',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
})