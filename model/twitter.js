const request = require('request');
const Oauth = require('./../libs/oauth');

class Twitter extends Oauth {
  constructor() { // eslint-disable-line
    super();
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
      tokenSecret,
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
<<<<<<< HEAD
     *  @return Promise
     */
  async updateStatus({ status, token, tokenSecret }) {
    return new Promise(async (resolve, reject) => {
      try {
        this.oa.post(
          'https://api.twitter.com/1.1/statuses/update.json',
          token,
          tokenSecret,
          (error, response) => {
            console.log('asfsf');
            if (error) {
              console.log(error);
              reject(error);
            }
            console.log(response);
            resolve(response);
          },
        );
      } catch (err) {
        console.log(err);
=======
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
      tokenSecret,
    };
    return new Promise(async (resolve, reject) => {
      try {
        request.post({ url: `https://api.twitter.com/1.1/statuses/update.json?status=${status}`, oauth },
          (e, r, body) => {
            if (e) {
              reject(e);
            }
            resolve(body);
          });
      } catch (err) {
        throw err;
>>>>>>> feature/engine-migrate
      }
    });
  }
}

module.exports = Twitter;
