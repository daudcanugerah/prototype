const TwitterModel = require('./../model/twitter');
const Model = require('./../model/model');
const PostModel = require('./../model/postModel');

class EngineTwitter extends TwitterModel {
    constructor(data) {
        super();
        this.schedule = data;
        this.post = {};
        this.account = {};
    }

    async runEngine() {
        await this.requipment();
    }

    async requipment() {
        let requestAccount = await Model.find({ collection: "account", args: [{ $sample: { $size: this.schedule.account } }] });
        let account = await requestAccount.toArray();
        this.account = account;
    }

    generateschedule(key) {
        switch (key) {
            case 'post':
                this.runPost();
                break;
            default:
                break;
        }
    }

    runPost() {
        this.updateStatus({ status, token, tokenSecret });
    }

}


module.exports = EngineTwitter;