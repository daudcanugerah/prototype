const Bcrypt = require('bcrypt');
const Model = require('./model');

class AuthModel extends Model {
  constructor() { // eslint-disable-line
    super();
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
}

module.exports = AuthModel;
