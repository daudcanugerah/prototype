const express = require('express');
const { account } = require('../controllers/index');

const app = express.Router();

/**
 *  Account Route
 */
app.get('/getAccountDTL', account.getAccountDTLS());
app.get('/', account.index());
app.get('/getCountJX', account.getCountJx());
app.post('/syncAccount', account.syncAccount());


module.exports = app;
