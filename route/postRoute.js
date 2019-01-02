const express = require('express');
const { post } = require('./../controllers/index');

const app = express.Router();

/**
 *  Post Route
 */
app.get('/getPostDTL', post.getPostDTLS());
app.get('/', post.index());
app.post('/addJX', post.addPostJX());

module.exports = app;
