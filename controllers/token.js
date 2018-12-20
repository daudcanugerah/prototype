const Twitter = require('../model/twitter');
const maccount = require('../model/maccount');

class Token extends Twitter {

    constructor() {
        super();
    }

    getRequestToken() {
        return async (req, res, next) => {
            try {
                let { requestToken } = await this.getOAuthRequestToken();
                res.json({ oAuthToken: requestToken });
            } catch (err) {
                console.log(err.message);
            }
        }

    }

    getAccessToken() {
        this.getAccessToken
        return async (req, res, next) => {
            try {
                let userToken = await this.getUserToken(req.query);
                let data = await this.verifyCredentials(userToken);
                let dataUser = JSON.parse(data);
                let { token, tokenSecret } = userToken;
                await maccount.setCredential({
                    ...dataUser, token, tokenSecret,created_at : Date(), updated_at : Date()
                });
                res.render('account/response', { message: "success" });
            } catch (err) {
                let error = JSON.parse(err);
                res.render('account/response', { message: error.data });
            }
        }
    }
}

module.exports = new Token;