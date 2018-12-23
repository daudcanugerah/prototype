const Oauth = require('./../libs/oauth');

class Twitter extends Oauth {
  constructor() {
    super();
  }

  verifyCredentials({ token, tokenSecret }) {
    return new Promise(async (resolve, reject) => {
      try {
        this.oa.get(
          'https://api.twitter.com/1.1/account/verify_credentials.json',
          token,
          tokenSecret,
          (error, response) => {
            if (error) {
              reject(error);
            }
            resolve(response);
          },
        );
      } catch (err) {
        throw err;
      }
    });
  }

  /**
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
      }
    });
  }
}

module.exports = Twitter;
