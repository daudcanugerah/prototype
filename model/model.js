const { getDb } = require('./../libs/database');
const { ObjectId } = require('mongodb');

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

  getInstance() { // eslint-disable-line
    return new Model();
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

  async aggregate({ collection, args }) { // eslint-disable-line class-methods-use-this
    try {
      const db = await getDb();
      const request = await db.collection(collection).aggregate([...args]);
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

  getObjectId(data = []) { // eslint-disable-line
    const localData = [];
    data.map((e) => {
      localData.push(ObjectId(e));
    });
    if (localData.length > 0) {
      return localData;
    }
    return localData[0];
  }
}

module.exports = Model;
