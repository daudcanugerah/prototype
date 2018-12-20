const Oauth = require('./../libs/oauth');

class Twitter extends Oauth {
    constructor() {
        super();
    }

    verifyCredentials({ token, tokenSecret }) {
        return new Promise(async (resolve, reject) => {
            try {
                this.oa.get(
                    ' https://api.twitter.com/1.1/account/verify_credentials.json',
                    token,
                    tokenSecret,
                    function (error, response) {
                        if (error) {
                            reject(error);
                        }
                        resolve(response);
                    }
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
                let request = await this.oa.get(
                    `https://api.twitter.com/1.1/statuses/update.json?` +
                    `status=${status}`,
                    token,
                    tokenSecret
                );
                resolve(request);

            } catch (err) {
                resolve(err);
            }
        })
    }
}

module.exports = Twitter;