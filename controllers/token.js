const Twitter = require('../model/twitter');
const maccount = require('../model/maccount');

class Token extends Twitter {
  constructor() { // eslint-disable-line
    super();
  }

  getRequestToken() {
    return async (req, res) => {
      try {
        const { requestToken } = await this.getOAuthRequestToken();
        res.json({ oAuthToken: requestToken });
      } catch (err) {
        throw err;
      }
    };
  }

  getAccessToken() {
    return async (req, res) => {
      try {
        const userToken = await this.getUserToken(req.query);
        const data = await this.verifyCredentials(userToken);
        const dataUser = JSON.parse(data);
        const { token, tokenSecret } = userToken;
        await maccount.setCredential({
          twitter_id: dataUser.id_str, profile: { ...dataUser }, token, tokenSecret, created_at: Date(), updated_at: Date(),
        });
        res.render('account/response', { message: 'success' });
      } catch (err) {
        const error = err;
        res.render('account/response', { message: error });
      }
    };
  }
}

module.exports = new Token();
