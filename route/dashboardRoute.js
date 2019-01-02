const express = require('express');
const { dashboard } = require('../controllers/index');

const app = express.Router();

/**
 *  Route Dashboard
 */
app.get('/', dashboard.index());

module.exports = app;
