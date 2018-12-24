const Model = require('./model');

class ScheduleModel extends Model {
    constructor(){ //eslint-disable-line
    super();
  }

  static getInstance() { // eslint-disable-line
    return new ScheduleModel();
  }

  async createLog(scheduleId) { //eslint-disable-line
    try {
      const requestInsert = await this.insertOne(
        {
          collection: 'Schedule_Log',
          args: [
            {
              schedule_id: this.getObjectId(scheduleId),
              posts: [],
              created_at: Date(),
              updated_at: Date(),
            },
          ],
        },
      );
      console.log(requestInsert);
      return requestInsert;
    } catch (err) {
      throw err;
    }
  }

  async createLogPost({
    logId, postId, accountId, tweetId, tweet, message, created_at, code,
  }) {
    try {
      const requestInsert = await this.updateOne({
        collection: 'Schedule_Log',
        args: [
          { _id: this.getObjectId(logId) },
          {
            $set: { updated_at: Date() },
            $push: {
              posts:
                {
                  post_id: this.getObjectId(postId),
                  account_id: this.getObjectId(accountId),
                  tweet_id: tweetId,
                  tweet,
                  note: {
                    message,
                    code,
                  },
                  created_at,
                },
            },
          },
        ],
      });
      return requestInsert;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = ScheduleModel;
