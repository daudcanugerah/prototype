const Model = require('./model');

class ScheduleModel extends Model {
    constructor(){ //eslint-disable-line
    super();
  }

  getInstance() { // eslint-disable-line
    return new ScheduleModel();
  }

  async createLog(data) { //eslint-disable-line
    const {
      startDate, endDate, scheduleId,
    } = data;
    try {
      const requestInsert = await this.insertOne(
        {
          collection: 'Schedule_Log',
          args: [
            {
              schedule_id: scheduleId,
              start: startDate,
              end: endDate,
              posts: [],
              created_at: Date(),
              updated_at: Date(),
            },
          ],
        },
      );
      return requestInsert;
    } catch (err) {
      throw err;
    }
  }

  async createLogPost({ scheduleId, ...data }) {
    const {
      postId, accountId, tweetId, tweet, note,
    } = data;
    try {
      const requestInsert = await this.insertOne({
        collection: 'Schedule_Log',
        args: [
          { schedule_id: scheduleId },
          {
            $push: {
              posts: {
                $each: [
                  {
                    post_id: this.getObjectId(postId),
                    account_id: this.getObjectId(accountId),
                    tweet_id: tweetId,
                    tweet,
                    note,
                  },
                ],
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
