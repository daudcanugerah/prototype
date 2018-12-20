const model = require('../model/model');
const { isset } = require('../libs/helper');
const moment = require('moment');
const Twitter = require('./../model/twitter')

class Account extends Twitter {

    constructor() {
        super();
    }

    index() {
        return (req, res) => {
            res.render('account/index.ejs', { linkTarget: 'account' });
        }
    }

    getAccountDTLS() {
        return async (req, res, next) => {
            let draw = req.query.draw;
            let start = Number(req.query.start);
            let recordTotal = Number(await model.count({ collection: 'account', args: {} }));
            let length = req.query.length <= 0 ? recordTotal : Number(req.query.length);
            let search = req.query.search;
            let order = req.query.order;

            let data = [];
            let account = await model.find({ collection: 'account', args: {} });
            let no = 0;
            let accountData = await account.skip(start).limit(length).sort({ 'created_at': -1 }).toArray();

            accountData.forEach(item => {
                data.push([
                    ((++no) + start),
                    item.id_str,
                    item.screen_name,
                    this.getStatusAccount(item),
                    moment(item.created_at).format("MMM DD YYYY, h:mm:ss"),
                    moment(item.updated_at).fromNow(),
                    "<button class='btn btn-sm btn-primary'>Detail</button>"
                ]);
            });
            let response = JSON.stringify({
                draw: draw,
                recordTotal,
                recordsFiltered: recordTotal,
                data: data
            })
            res.send(response);
        }
    }

    getStatusAccount(item) {
        var status = "";
        if (item.suspended) {
            status += `<span class="badge badge-secondary">Suspend</span>`;
        } else if (item.needs_phone_verification) {
            status += `<span class="badge badge-secondary">Suspend</span>`;
        } else {
            status += `<span class="badge badge-secondary">Active</span>`
        }
        return status;
    }

    getCountJx() {
        return async (req, res, next) => {
            try {
                let recordTotal = await model.count({ collection: 'account', args: {} });
                res.json(recordTotal);
            } catch (e) {
                throw e;
            }
        }
    }

    syncAccount() {
        return async (req, res, next) => {
            try {
                let response = await model.find({ collection: "account", args: {} });
                let data = await response.toArray();
                let credentials = {};
                for (let i = 0; i < data.length; i++) {
                    try {
                        let credential = await this.verifyCredentials({ token: data[i].token, tokenSecret: data[i].tokenSecret });
                        let credentialParse = JSON.parse(credential);
                        credentialParse.updated_at = Date();
                        credentials = { credentials, ...credentialParse }
                    } catch (err) {
                        console.log(err);
                    }
                }
                await model.updateMany({ collection: "account", args: [{}, { $set: { ...credentials } }, { $upsert: true }] });
                res.json(credentials);
            } catch (err) {
                console.log(err);
            }
        }
    }
}

module.exports = new Account;