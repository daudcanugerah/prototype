
const Model = require('./model');

class PostModel {
  constructor() {
    this.model = new Model();
  }
  /**
     *
     * @param  Array categoriesId
     * @param  Int  limit
     * @description get random post
     * @return Array
     */
  async getSamplePost({ categoriesId, limit }) { // eslint-disable-line
    try {
      const requestQuery = await this.model.find({
        category_id: { $in: [...categoriesId] },
      }).limit(limit);
      return requestQuery.toArray();
    } catch (err) {
      throw err;
    }
  }
}

module.exports = PostModel;
