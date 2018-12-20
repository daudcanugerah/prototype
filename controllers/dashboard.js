const model = require('../model/model');
// const { isset } = require('../libs/helper');
// const moment = require('moment');
// const Twitter = require('./../model/twitter')

class Dashboard {

    index() {
        return (req, res) => {
            res.render('dashboard/index.ejs', { linkTarget: 'account' });
        }
    }
}

module.exports = new Dashboard;