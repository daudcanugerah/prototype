const { isset } = require('./../libs/helper');
const authModel = require('./../model/authModel').getInstance();

class AuthMiddleware {
  checkAuth({ except = [], allowAuth = true,redirectTo = '/' }) { // eslint-disable-line
    return (req, res, next) => {
      if (isset(req.session.isLogin) && allowAuth) {
        let render = res.render; //eslint-disable-next-line
        res.render = async () => {
          res.locals.auth = await authModel.getUserInfo(req.session.userId);
          render.apply(res, arguments);
        };
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
