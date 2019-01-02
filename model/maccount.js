const { getDb } = require('../libs/database');
const Model = require('./model');

const DEFAULT_COLLECTION = 'account';

class AccountModel extends Model {
  constructor() {
    super();
  }

  getInstance() {
    return new AccountModel();
  }

  async getAccounts(args) {
    try {
      const db = await getDb();
      const request = await db.collection(DEFAULT_COLLECTION).find(args);
      return request.toArray();
    } catch (err) {
      throw err;
    }
  }

  async getPagiAccounts(skip, limit) {
    try {
      const db = await getDb();
      const request = await db.collection(DEFAULT_COLLECTION).find({ skip, limit });
      return request.toArray();
    } catch (err) {
      throw err;
    }
  }

  async setCredential(data) {
    try {
      const db = await getDb();
      let request;
      const accountExist = await this.getAccounts({
        twitter_id: data.twitter_id,
      });
      if (accountExist.length > 0) {
        request = await db.collection(DEFAULT_COLLECTION).updateOne({ twitter_id: data.twitter_id }, { $set: { ...data } }, { upsert: true });
      } else {
        request = await db.collection(DEFAULT_COLLECTION).insertOne(data);
      }
      return request;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new AccountModel();
