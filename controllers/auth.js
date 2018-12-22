const AuthModel = require('./../model/authModel');

class Auth {
  constructor() {
    this.AuthModel = AuthModel;
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
        res.redirect('/app/dashboard');
      } else {
        req.flash('info', 'Login Failed Incorent Username or Password');
        res.redirect('/login');
      }
    };
  }

  logout() { // eslint-disable-line
    return (req, res) => {
      req.session.isLogin = null;
      req.session.idUser = null;
      req.flash('info', 'Logout Succes');
      res.redirect('/');
    };
  }
}

module.exports = new Auth();
