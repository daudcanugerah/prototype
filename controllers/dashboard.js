// const model = require('../model/model');
// const { isset } = require('../libs/helper');
// const moment = require('moment');
// const Twitter = require('./../model/twitter')

class Dashboard {
  index() { //eslint-disable-line
    return (req, res) => {
      res.render('dashboard/index.ejs', { linkTarget: 'account', username: 'Daud' });
    };
  }
}

module.exports = new Dashboard();
