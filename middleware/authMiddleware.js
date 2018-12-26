const { isset } = require('./../libs/helper');

class AuthMiddleware {
  checkAuth({ except = [], allowAuth = true,redirectTo = '/' }) { // eslint-disable-line
    return (req, res, next) => {
      // || this.except(except, req.originalUrl)
      if (isset(req.session.isLogin) && allowAuth) {
        next();
      } else if (!isset(req.session.isLogin) && !allowAuth) {
        next();
      } else {
        res.redirect(redirectTo || '/');
      }
    };
  }

  except(except = [], currentUrl) { // eslint-disable-line
    const localExcept = except.filter(a => a === currentUrl);
    const result = localExcept.length > 0;
    return result;
  }
}

module.exports = new AuthMiddleware();
