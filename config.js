// Configurating global variables

'use strict';

// DB
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/v_img_crate';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/v_img_crate_test';
exports.PORT = process.env.PORT || 8080;

//Authentication
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';