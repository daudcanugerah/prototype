const express = require('express');
const { token } = require('./../controllers/index');

const app = express.Router();

/**
*  Token Route
*/
app.get('/cb_twitter', token.getAccessToken());
app.get('/getRequestToken', token.getRequestToken());

module.exports = app;
