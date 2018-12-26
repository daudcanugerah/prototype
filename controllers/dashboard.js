const authModel = require('./../model/authModel').getInstance();

class Dashboard {
  index() { //eslint-disable-line
    return async (req, res) => {
      const auth = await authModel.getUserInfo(req.session.idUser);
      res.render('dashboard/index.ejs', { linkTarget: 'account', username: auth.username });
    };
  }
}

module.exports = new Dashboard();
