const request = require('request');
const Oauth = require('./../libs/oauth');

class Twitter extends Oauth {
  constructor() { // eslint-disable-line
    super();
  }

  static initialize() {
    return new Twitter();
  }

  /**
   *
   * @param string token
   * @param string tokenSecret
   * @desc  Check Credentials / get User Profile
   * @return Promises
   */
  verifyCredentials({ token, tokenSecret }) {
    const oauth = {
      ...this.paramOauth,
      token,
      token_secret: tokenSecret,
    };
    return new Promise(async (resolve, reject) => {
      try {
        request.get({ url: ' https://api.twitter.com/1.1/account/verify_credentials.json', oauth },
          (e, r, body) => {
            if (e) {
              reject(e);
            }
            resolve(body);
          });
      } catch (err) {
        throw err;
      }
    });
  }

  /**
   *
   * @param string status
   * @param string token
   * @param string tokenSecret
   * @desc  Update status twitter
   * @return Promises
   */
  async updateStatus({ status, token, tokenSecret }) {
    const oauth = {
      ...this.paramOauth,
      token,
      token_secret: tokenSecret,
    };
    return new Promise(async (resolve, reject) => {
      try {
        request.post({ url: `https://api.twitter.com/1.1/statuses/update.json?status=${status}`, oauth },
          (e, r, body) => {
            if (e) {
              reject(e);
            } else if (r.statusCode != 200) {
              const result = JSON.parse(body).errors[0];
              resolve(result);
            }
            const result = JSON.parse(body);
            resolve(result);
          });
      } catch (err) {
        throw err;
      }
    });
  }
}

module.exports = Twitter;
