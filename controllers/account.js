/* eslint-disable */
const DB = require('../model/model');
const { isset } = require('../libs/helper');
const moment = require('moment');
const Twitter = require('./../model/twitter');

class Account extends Twitter {
  constructor() {
    super();
    this.model = new DB;
  }

  index() {
    return async (req, res) => {
      res.render('account/index.ejs', { linkTarget: 'account'});
    };
  }

  getAccountDTLS() {
    return async (req, res, next) => {
      const draw = req.query.draw;
      const start = Number(req.query.start);
      const recordTotal = Number(await this.model.count({ collection: 'account', args: [{}] }));
      const length = req.query.length <= 0 ? recordTotal : Number(req.query.length);
      const search = req.query.search;
      const order = req.query.order;

      const data = [];
      const account = await this.model.find({ collection: 'account', args: [{}] });
      let no = 0;
      const accountData = await account.skip(start).limit(length).sort({ created_at: -1 }).toArray();

      accountData.forEach((item) => {
        data.push([
          ((++no) + start),
          item.twitter_id,
          item.profile.screen_name,
          this.getStatusAccount(item.profile),
          moment(item.created_at).format('MMM DD YYYY, h:mm:ss'),
          moment(item.updated_at).fromNow(),
          "<button class='btn btn-sm btn-primary'>Detail</button>",
        ]);
      });
      const response = JSON.stringify({
        draw,
        recordTotal,
        recordsFiltered: recordTotal,
        data,
      });
      res.send(response);
    };
  }

  getStatusAccount(item) {
    let status = '';
    if (item.suspended) {
      status += '<span class="badge badge-secondary">Suspend</span>';
    } else if (item.needs_phone_verification) {
      status += '<span class="badge badge-secondary">Suspend</span>';
    } else {
      status += '<span class="badge badge-secondary">Active</span>';
    }
    return status;
  }

  getCountJx() {
    return async (req, res, next) => {
      try {
        const recordTotal = await this.model.count({ collection: 'account', args: [{}] });
        res.json(recordTotal);
      } catch (e) {
        throw e;
      }
    };
  }

  syncAccount() {
    return async (req, res, next) => {
      try {
        const response = await this.model.find({ collection: 'account', args: [{}] });
        const data = await response.toArray();
        let credentials = {};
        for (let i = 0; i < data.length; i++) {
          try {
            const credential = await this.verifyCredentials({ token: data[i].token, tokenSecret: data[i].tokenSecret });
            const credentialParse = JSON.parse(credential);
            let curentAccount = {twitter_id: credentialParse.id_str, profile: { ...credentialParse }, token: data[i].token, tokenSecret: data[i].tokenSecret, updated_at: Date()};
            credentials = { credentials, ...curentAccount };
          } catch (err) {
            throw err;
          }
        }
        await this.model.updateMany({ collection: 'account', args: [{}, { $set: { ...credentials } }, { $upsert: true }] });
        res.json(credentials);
      } catch (err) {
        throw err;
      }
    };
  }
}

module.exports = new Account();
