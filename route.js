const express = require('express');
const {
  account, post, category, token, schedule, dashboard,
} = require('./controllers/index');

const app = express.Router();
const { isset } = require('./libs/helper');
/**
 *  Route Datatables
 */

app.get('/getAccountDTL', account.getAccountDTLS());
app.get('/getPostDTL', post.getPostDTLS());
app.get('/getScheduleDTL', schedule.getScheduleDTLS());

/**
 *  Route Dashboard
 */
app.get('/dashboard', dashboard.index());

/**
 *  Account Route
 */
app.get('/account', account.index());
app.get('/account/getCountJX', account.getCountJx());
app.post('/account/syncAccount', account.syncAccount());

/**
 *  Post Route
 */
app.get('/post', post.index());
app.post('/post/addJX', post.addPostJX());

/**
 *  Category Route
 */
app.post('/category/addJX', category.addCategoryJX());
app.get('/category/getCategoryJX', category.getCategoryJX());

/**
 *  Schedule Route
 */

app.get('/schedule/add', schedule.add());
app.post('/schedule/addAction', schedule.addAction());
app.get('/schedule', schedule.index());
app.get('/schedule/start/:id*?', (req, res, next) => {
  const response = isset(req.params.id) ? startCron(req.params.id) : startCron();
  res.json(response);
});
app.get('/schedule/stop/:id*?', (req, res, next) => {
  const response = isset(req.params.id) ? stopCron(req.params.id) : stopCron();
  res.json(response);
});


/**
*  Token Route
*/
app.get('/token/cb_twitter', token.getAccessToken());
app.get('/token/getRequestToken', token.getRequestToken());

/**
 *  file Upload Route
 */


/**
 *  custom page 404
 */

app.get('/*', (req, res) => {
  res.send('what???', 404);
});

module.exports = app;
