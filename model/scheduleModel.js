const Model = require('./model');

class ScheduleModel extends Model {
  constructor() { //eslint-disable-line
    super();
  }

  static getInstance() { // eslint-disable-line
    return new ScheduleModel();
  }

  async createLog(scheduleId) { //eslint-disable-line
    try {
      const requestInsert = await this.insertOne(
        {
          collection: 'schedule_log',
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
      console.log(`log for schedule Id ${scheduleId} created`);
      return requestInsert;
    } catch (err) {
      throw err;
    }
  }

  /**
   * @method updateSchedule()
   * @param Object name -> String |
   * @desc update schedule
   * @return Promises
   */
  async updateSchedule({
    categoryId, account, type, name, scheduleId,
  }) {
    // convert to format array object
    const localCategoryId = [];
    categoryId.forEach((item) => {
      localCategoryId.push({
        _id: this.getObjectId(item),
      });
    });
    try {
      const request = await this.updateOne({
        collection: 'schedule',
        args: [
          { _id: this.getObjectId(scheduleId) },
          {
            $set: {
              name,
              type,
              account,
              category_id: localCategoryId,
            },
          },
        ],
      });
      return request;
    } catch (err) {
      throw err;
    }
  }

  async checkScheduleExist({ name = null, cronFormat = null }) {
    const customfilter = name === null ? { name: { $eq: name } } : { format: { $eq: cronFormat } };
    try {
      const request = await this.aggregate(
        {
          collection: 'schedule',
          args: [
            {
              $match: {
                $and: [
                  {
                    deleted_at: { $exists: false },
                  },
                  customfilter,
                ],
              },
            },
          ],
        },
      );
      return request.toArray();
    } catch (err) {
      throw err;
    }
  }

  async createLogPost({
    logId, postId, accountId, tweetId, tweet, message, created_at, code,
  }) {
    try {
      const requestInsert = await this.updateOne({
        collection: 'schedule_log',
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

  async getSchedule({ id = null, deleted = false, extra }) {
    const filterId = id == null ? {} : { _id: this.getObjectId(id) };
    const filterDeleted = deleted === false ? { deleted_at: { $exists: false } } : { deleted_at: { $exists: true } };
    try {
      const request = await this.aggregate(
        {
          collection: 'schedule',
          args: [
            {
              $match: {
                $and: [
                  filterId,
                  filterDeleted,
                ],
              },
            },
            {
              $lookup: {
                from: 'category',
                localField: 'category_id._id',
                foreignField: '_id',
                as: 'categories',
              },
            },
            {
              $project: {
                _id: 1,
                name: 1,
                type: 1,
                account: 1,
                extra,
                categories: 1,
              },
            },
          ],
        },
      );
      return request.toArray();
    } catch (e) {
      throw e;
    }
  }

  /**
   * @method deleteSchedule()
   * @param String scheduleId
   * @desc menghapus schedule berdasarkan ID
   * @return Promises
   */
  async deleteSchedule(scheduleId) {
    try {
      const request = await this.updateOne({ collection: 'schedule', args: [{ _id: this.getObjectId(scheduleId) }, { $set: { deleted_at: Date() } }] });
      return request;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = ScheduleModel;
