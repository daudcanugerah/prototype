const TwitterModel = require('./../model/twitter');
const Model = require('./../model/model');
const PostModel = require('./../model/postModel');

class EngineTwitter extends TwitterModel {
  constructor(data) {
    super();
    this.model = new Model();
    this.schedule = data;
    this.post = {};
    this.account = {};
    this.post = new PostModel();
  }

  async runEngine() {
    await this.requipment();
    // this.schedule.type.map((type) => {
    //   for (let i = 0; i < this.account.length; i += 1) {
    // this.generateSchedule({
    //   type,
    //   token: this.account[i].token,
    //   tokenSecret: this.account[i].tokenSecret,
    // });
    //   }
    // });
  }

  async requipment() {
    const requestAccount = await this.model.aggregate({ collection: 'account', args: [{ $sample: { size: 1 } }] });
    const account = await requestAccount.toArray();
    this.account = account;
  }

  generateSchedule({ type, token, tokenSecret }) {
    switch (type) {
      case 'post':
        this.runPost(token, tokenSecret);
        break;
      default:
        break;
    }
  }

  runPost(token, tokenSecret) {
    this.updateStatus({ status: 'Hello World, Welcome Back', token, tokenSecret });
  }
}


module.exports = EngineTwitter;
