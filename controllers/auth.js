const AuthModel = require('./../model/authModel');

class Auth {
  constructor() {
    this.AuthModel = new AuthModel();
  }

  loginPage() { //eslint-disable-line 
    return async (req, res) => {
      res.render('auth/login');
    };
  }

  loginAction() {
    return async (req, res) => {
      const { username, password } = req.body;
      const dataUser = await this.AuthModel.checkAuth({ username, password });
      if (dataUser) {
        req.session.isLogin = true;
        req.session.idUser = String(dataUser._id); // eslint-disable-line no-underscore-dangle
        req.session.save();
        req.flash('info', `Login Success, Welcome ${dataUser.username}`);
        res.redirect('/app/schedule');
      } else {
        req.flash('info', 'Login Failed Incorent Username or Password');
        res.redirect('/login');
      }
    };
  }

  logout() { // eslint-disable-line
    return async function (req, res, next) {
    };
  }
}

module.exports = new Auth();
