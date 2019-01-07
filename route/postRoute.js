const express = require('express');
const { post } = require('./../controllers/index');
const { postValidator } = require('./../validator/index');

const app = express.Router();

/**
 *  Post Route
 */
app.get('/getPostDTL', post.getPostDTLS());
app.get('/', post.index());
app.post('/add', postValidator.add(), post.add());

module.exports = app;
