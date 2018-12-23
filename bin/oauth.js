/* eslint-disable */
const request = require('request');
const { isset } = require('./../libs/helper');
const qs = require('query-string'); 

class Oauth {
  constructor() {
      this.paramOauth = {
            consumer_key: this.consumer_key,
            consumer_secret: this.consumer_secret,     
      }
  }

  /**
   *  Step 1
   *  @desc get oauth_token and oauth_token_secret from twitter 
   *  @return Promises : oauth_token oauth_token_secret
   *  @see 3 legged oauth 1.0
   */
  async getOAuthRequestToken() {
    let oauth = {
        callback: 'http://127.0.0.1:3000/app/token/cb_twitter',
        ...this.paramOauth
    },url = 'https://api.twitter.com/oauth/request_token';
    return new Promise((resolve,reject)=>{
          try{
            request.post({url,oauth}, function (e, r, body){
                if(e){
                    reject(e);
                }
                let {oauth_token,oauth_token_secret} = qs.parse(body);
                resolve({
                    requestToken : oauth_token,
                    requestTokenSecret : oauth_token_secret
                });
            }); 
          }catch(err){
              throw err;
          }    
      }); 
     }
     /**
      * Step 2
      * @param {string} token 
      * @param {string} requestToken - from getOauthToken() 
      * @return Promises 
      * @desc  get verifier from twitter after redirect
      */
  getOAuthRequestTokenCallBack(token, requestToken) {
    return new Promise((resolve, reject) => {
      if (isset(token.oauth_token) && isset(token.oauth_verifier)) {
        return resolve({ callbackToken: token.oauth_token, callbackTokenVerifier: token.oauth_verifier, ...requestToken });
      } if (isset(token.denied)) {
        return reject(JSON.stringify({ data: 'Error access denied' }));
      }
      return reject(JSON.stringify({ data: 'Missing parameter' }));
    });
  }

  /**
    * Step 3
    * @param {Object} token - from getOAuthRequestTokenCallBack(); 
    * @return Promises
    * @desc get userToken
    */
  async getOAuthAccessToken(token) {
    const { callbackToken, requestTokenSecret, callbackTokenVerifier } = token;
    let oauth = {
        consumer_key: "0wN7qQs43aeAWBVP0Za7xzLOD",
        consumer_secret: "LECLHsBOjJ8uiAWRu65GC0RnlHpe8z4dEfrFqEohPMq7HHckHe",
        token: callbackToken,
        token_secret: requestTokenSecret,
        verifier: callbackTokenVerifier,
    },
    url = 'https://api.twitter.com/oauth/access_token';
    return new Promise((resolve, reject) => {
        try{
            request.post({url,oauth},(e,r,body)=>{
                if(e){
                    reject(e);
                }
                let {oauth_token,oauth_token_secret,user_id,screen_name} = qs.parse(body); 
                resolve({
                    token : oauth_token,
                    tokenSecret : oauth_token_secret
                });
            });
        }catch(err){
            throw err;
        }
    });
  }

  async getUserToken(token) {
    try {
      const requestToken = await this.getOAuthRequestToken();
      const callbackToken = await this.getOAuthRequestTokenCallBack(token, requestToken);
      const accesToken = await this.getOAuthAccessToken(callbackToken);
      return accesToken;
    } catch (e) {
      throw e;
    }
  }
}
// module.exports = Oauth;
module.exports = Oauth;
