const Model = require('./../model/model');
const PostModel = require('./../model/postModel').getInstance();
const TwitterModel = require('./../model/twitter');

class EngineTwitter extends TwitterModel {
  constructor(data) {
    super();
    this.model = new Model();
    this.schedule = data;
    this.post = {};
    this.account = {};
  }

  async runEngine() {
    await this.getRandomAccount();
    this.schedule.type.map((type) => {
      for (let i = 0; i < this.account.length; i += 1) {
        this.generateSchedule({
          type,
          ...this.account[i],
        });
      }
    });
  }

  async getRandomAccount() {
    const requestAccount = await this.model.aggregate({ collection: 'account', args: [{ $sample: { size: 1 } }] });
    const account = await requestAccount.toArray();
    this.account = account;
  }

  generateSchedule({ type, ...data }) {
    switch (type) {
      case 'post':
        this.runPost(data);
        break;
      default:
        break;
    }
  }
  
  async runPost({ token, tokenSecret }) {
    const categoryId = Object.values(this.schedule.category_id).map(e => e._id.toString());
    const requestPost = await PostModel.getSamplePost(categoryId);
    const post = await requestPost.toArray();
    this.updateStatus({ status: post[0].content, token, tokenSecret }).then((e) => {
      console.log(e);
    }).catch((e) => {
      console.log(e);
    });
  }
}


module.exports = EngineTwitter;
