const oauth = require('oauth').OAuth;
const { isset } = require('./../libs/helper');

class Oauth {
    constructor() {
        this.oa = this.initialize();
    }

    initialize() {
        try {
            let data = new oauth(
                'https://api.twitter.com/oauth/request_token',
                'https://api.twitter.com/oauth/access_token',
                'smYhmOzlJzNbqq6KTcChsKVQs',
                'WFCJmWgVMJjNvnqGpTzZfLZMK9bYt77miiKdy1ThQO8NbwgzDS',
                process.env.OAUTH_VERSION,
                null,
                process.env.OAUTH_SIGNATURE_METHOD
            );
            return data;
        } catch (err) {
            throw new error('Error Database');
        }
    }
    /**
     *   
     */
    async getOAuthRequestToken() {
        return new Promise((resolve, reject) => {
            this.oa.getOAuthRequestToken(async function (error, oAuthToken, oAuthTokenSecret, results) {
                if (error) {
                    reject(error({ message: 'error request token', code: '401' }));
                }
                resolve({ requestToken: oAuthToken, requestTokenSecret: oAuthTokenSecret });
            });
        });
    }

    getOAuthRequestTokenCallBack(token, requestToken) {
        return new Promise((resolve, reject) => {
            if (isset(token.oauth_token) && isset(token.oauth_verifier)) {
                return resolve({ callbackToken: token.oauth_token, callbackTokenVerifier: token.oauth_verifier, ...requestToken });
            } else if (isset(token.denied)) {
                return reject(JSON.stringify({ data: 'Error access denied' }));
            } else {
                return reject(JSON.stringify({ data: 'Missing parameter' }));
            }
        })
    }

    async getOAuthAccessToken(token) {
        let { callbackToken, requestTokenSecret, callbackTokenVerifier } = token;
        return new Promise((resolve, reject) => {
            this.oa.getOAuthAccessToken(
                callbackToken,
                requestTokenSecret,
                callbackTokenVerifier,
                function (error, oAuthAccessToken, oAuthAccessTokenSecret, results) {
                    if (error) {
                        reject(JSON.stringify(error));
                    }
                    resolve({ ...token, token: oAuthAccessToken, tokenSecret: oAuthAccessTokenSecret });
                });
        })
    }

    async getUserToken(token) {
        try {
            let requestToken = await this.getOAuthRequestToken();
            let callbackToken = await this.getOAuthRequestTokenCallBack(token, requestToken);
            let accesToken = await this.getOAuthAccessToken(callbackToken);
            return accesToken;
        } catch (e) {
            throw e;
        }
    }
}

module.exports = Oauth;