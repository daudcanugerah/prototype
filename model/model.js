const { getDb } = require('./../libs/database');

class Model {
  async find({ collection, args }) { // eslint-disable-line class-methods-use-this
    try {
      const db = await getDb();
      const request = await db.collection(collection).find(...args);
      return request;
    } catch (err) {
      throw err;
    }
  }

  async findOne({ collection, args }) { // eslint-disable-line class-methods-use-this
    try {
      const db = await getDb();
      const request = await db.collection(collection).findOne(...args);
      return request;
    } catch (err) {
      throw err;
    }
  }

  async aggregate({ collection, ...args }) { // eslint-disable-line class-methods-use-this
    try {
      const db = await getDb();
      const request = await db.collection(collection).aggregate(args.args);
      return request;
    } catch (err) {
      throw err;
    }
  }


  async count({ collection, args }) { // eslint-disable-line class-methods-use-this
    try {
      const db = await getDb();
      const request = await db.collection(collection).count(...args);
      return request;
    } catch (err) {
      throw err;
    }
  }

  async insertOne({ collection, args }) { // eslint-disable-line class-methods-use-this
    try {
      const db = await getDb();
      const request = await db.collection(collection).insertOne(...args);
      console.log(request);
    } catch (err) {
      throw err;
    }
  }

  async updateMany({ collection, args }) { // eslint-disable-line class-methods-use-this
    try {
      const db = await getDb();
      const request = await db.collection(collection).updateMany(...args);
      console.log(request);
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Model;
