const express = require('express');
const { account, post, category, token, schedule, dashboard } = require('./controllers/index');
// const { postValidation } = require('./validations/index');
const { upload, imageFilter, isset, getCronFormat, converToCron } = require('./libs/helper')
const Model = require('./model/model');
const app = express.Router();
const { startCron, stopCron } = require('./libs/cron');
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
app.get('/schedule/start/:id*?', function (req, res, next) {
    let response = isset(req.params.id) ? startCron(req.params.id) : startCron();
    res.json(response);
});
app.get('/schedule/stop/:id*?', function (req, res, next) {
    let response = isset(req.params.id) ? stopCron(req.params.id) : stopCron();
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
module.exports = app;