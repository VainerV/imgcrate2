// Configurating global variables

'use strict';
//const env = require('./env')
// DB
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/v_img_crate';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/v_img_crate_test';
exports.PORT = process.env.PORT || 8080;

//AWS
exports.AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY
exports.AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID
exports.AWS_REGION = process.env.AWS_REGION


//Authentication
exports.JWT_SECRET = process.env.JWT_SECRET || 'secret';
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
