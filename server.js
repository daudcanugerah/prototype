require('dotenv').config();
const express = require('express');
const flash = require('express-flash');

const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const listEndpoints = require('express-list-endpoints');
const session = require('express-session');
const AppRoute = require('./route');
const { runCron } = require('./libs/cron');
const { connect } = require('./libs/database');

const app = express();
// const authMiddleware = require('./middleware/authMiddleware');
const { auth } = require('./controllers/index');

const middleware = [
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true }),
  morgan('combined'),
  session({ secret: process.env.APP_SECRET_AUTH, cookie: { maxAge: 60000 } }),
  flash(),
];

app.use(middleware);
app.set('trust proxy', 1);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname, 'public')));

/**
 *  Route Auth
 */

app.get('/login', auth.loginPage());
app.post('/loginAction', auth.loginAction());
app.get('/logout', auth.logout());

/**
 *  Route APP
 * authMiddleware.checkAuth({ allowAuth: true })
 *  authMiddleware.checkAuth({ allowAuth: true })
 */

app.use('/app', AppRoute);

/**
 *  Custom Page
 *  404
 *  403
 */

app.get('/forbiden', (req, res) => {
  res.send('Forbiden', 403);
});

app.get('*', (req, res) => {
  res.send('404 Page Not Found', 404);
});


const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', async () => {
  console.log(`Listening on Port ${port}`);
  try {
    await connect();
    await runCron();
    console.log(listEndpoints(app));
  } catch (err) {
    throw err;
  }
});
