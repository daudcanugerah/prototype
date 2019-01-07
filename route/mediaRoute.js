const express = require('express');
const { media } = require('../controllers/index');
const { upload } = require('./../libs/helper');
const { mediaValidator } = require('./../validator/index');

const app = express.Router();

/**
 *  Media Route
 */
app.post('/upload', upload().array('media', 1), mediaValidator.uploadImage(), media.upload());

module.exports = app;
