const express = require('express');
const {
  schedule, token, account, category, dashboard, post, media,
} = require('./route/index');

const app = express.Router();

app.use('/schedule', schedule);
app.use('/token', token);
app.use('/category', category);
app.use('/post', post);
app.use('/account', account);
app.use('/dashboard', dashboard);
app.use('/media', media);

/**
 *  custom page 404
 */

app.get('/*', (req, res) => {
  res.send('what???', 404);
});

module.exports = app;
