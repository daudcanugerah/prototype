const Bcrypt = require('bcrypt');
const Model = require('./model');
const { ObjectId } = require('mongodb');

class AuthModel extends Model {
  constructor() { // eslint-disable-line
    super();
  }

  static getInstance() {
    return new AuthModel();
  }

  async checkAuth({ username, password }) {
    try {
      const requestDb = await this.findOne({ collection: 'user', args: [{ username }] });
      const comparePassword = await Bcrypt.compare(password, String(requestDb.password));
      if (comparePassword) {
        return requestDb;
      }

      return false;
    } catch (e) {
      throw e;
    }
  }

  async getUserInfo(id) {
    try {
      const localId = String(id);
      const userInfo = await this.findOne({ collection: 'user', args: [{ _id: ObjectId(localId) }] });
      return userInfo;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = AuthModel;
