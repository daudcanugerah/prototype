const { isset } = require('./../libs/helper');
const authModel = require('./../model/authModel').getInstance();

class AuthMiddleware {
  checkAuth({ except = [], allowAuth = true,redirectTo = '/' }) { // eslint-disable-line
    return (req, res, next) => {
      if (isset(req.session.isLogin) && allowAuth) {
        // Grap render
        const _render = res.render;

        // Override logic
        res.render = async function (view, options, cb) {
          // Add logic (Example)
          const { username, _id } = await authModel.getUserInfo(req.session.userId);
          options.auth = { username, userId: _id };
          // Original call
          _render.call(this, view, options, cb);
        };
        next();
      } else if (!isset(req.session.isLogin) && !allowAuth) {
        next();
      } else {
        res.redirect(redirectTo || '/app/dashboard');
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
