require('dotenv').config()
const express = require('express');
const { connect } = require('./libs/database');
const { runCron } = require('./libs/cron');

const path = require('path');
const morgan = require('morgan');
const AppRoute = require('./route');
const bodyParser = require('body-parser');
const listEndpoints = require('express-list-endpoints');

const app = express();

const middleware = [
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
    morgan('combined'),
];

app.use(middleware);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use('/app', AppRoute);

// log endpoint
app.use((err, req, res, next) => {
    console.log(err.code);
    return true;
});
var port = process.env.PORT || 3000;
	app.listen(port, "0.0.0.0", function() {
	console.log("Listening on Port 3000");
});

(async () => {
    try {
        await connect();
        await runCron();
        console.log(listEndpoints(app));
    } catch (err) {
        throw err;
    }
})();
