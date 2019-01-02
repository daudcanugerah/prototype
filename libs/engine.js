const Model = require('./../model/model');
const PostModel = require('./../model/postModel').getInstance();
const TwitterModel = require('./../model/twitter');
const ScheduleModel = require('./../model/scheduleModel').getInstance();

class EngineTwitter extends TwitterModel {
  constructor(data) {
    super();
    this.model = new Model();
    this.schedule = data;
    this.post = {};
    this.account = {};
    this.log = {};
  }

  /**
   *  Create Log
   */
  async runEngine() {
    await this.getRandomAccount();
    // Create Log
    this.log = await ScheduleModel.createLog(this.schedule._id.toString()); //eslint-disable-line
    this.schedule.type.map((type) => {
      for (let i = 0; i < this.account.length; i += 1) {
        console.log(`log info. running  account ${this.account[i].profile.name}`);
        this.generateSchedule({
          type,
          ...this.account[i],
        });
      }
    });
  }

  async getRandomAccount() {
    const requestAccount = await this.model.aggregate({ collection: 'account', args: [{ $sample: { size: Number(this.schedule.account) } }] });
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

  /* eslint-disable no-underscore-dangle */
  async runPost({ token, tokenSecret, _id }) {
    try {
      // change all _id mongo in post category, to string
      const categoryId = Object.values(this.schedule.category_id).map(e => e._id.toString());
      // get sample post by category ID
      const post = await PostModel.getSamplePost(categoryId);
      console.log(`log info. post ${post[0].content}`);
      // if log empty
      const {
        id_str = null, created_at = Date(), message = 'succes', code = 200,
      } = await this.updateStatus({ status: post[0].content, token, tokenSecret });
      // Create Log Post
      console.log(`log info. status Post ${code === 200}`);
      ScheduleModel.createLogPost({
        logId: this.log.ops[0]._id.toString(),
        postId: post[0]._id.toString(),
        accountId: _id.toString(),
        tweetId: id_str,
        tweet: code === 200,
        message,
        code,
        created_at,
      });
    } catch (err) {
      throw err;
    }
  }
}
module.exports = EngineTwitter;
