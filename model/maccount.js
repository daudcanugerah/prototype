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

  async getAccounts(...args) {
    try {
      const db = await getDb();
      const request = await db.collection(DEFAULT_COLLECTION).find({ args });
      return request.toArray();
    } catch (err) {
      console.log(err);
    }
  }

  async getPagiAccounts(skip, limit) {
    try {
      const db = await getDb();
      const request = await db.collection(DEFAULT_COLLECTION).find({ skip, limit });
      return request.toArray();
    } catch (err) {
      console.log(err);
    }
  }

  async setCredential(data) {
    try {
      const db = await getDb();
      const userExist = await this.getAccounts({
        id_str: data.id_str,
      });
      if (userExist) {
        const request = await db.collection(DEFAULT_COLLECTION).updateOne({ id_str: data.id_str }, { $set: { ...data } }, { upsert: true });
      } else {
        const request = await db.collection(DEFAULT_COLLECTION).insertOne(data);
      }
      return request;
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new AccountModel();
