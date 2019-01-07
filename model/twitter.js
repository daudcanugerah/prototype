const request = require('request');
const fs = require('fs');
const qs = require('query-string');
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
    const url = `https://api.twitter.com/1.1/statuses/update.json?status=${encodeURIComponent(status)}`;
    return new Promise(async (resolve, reject) => {
      try {
        request.post({ url, oauth },
          (e, r, body) => {
            if (e) {
              reject(e);
            } else if (r.statusCode !== 200) {
              const result = JSON.parse(body).errors[0];
              resolve(result);
            }
            console.log(body);
            const result = JSON.parse(body);
            resolve(result);
          });
      } catch (err) {
        reject(err);
      }
    });
  }

  async uploadMedia({ media, token, tokenSecret }) {
    const oauth = {
      ...this.paramOauth,
      token,
      token_secret: tokenSecret,
    };
    const formData = {
      media: fs.createReadStream(media.path),
    };
    return new Promise(async (resolve, reject) => {
      try {
        request.post({ url: 'https://upload.twitter.com/1.1/media/upload.json', oauth, formData },
          (e, r, body) => {
            if (e) {
              reject(e);
            } else if (r.statusCode !== 200) {
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
