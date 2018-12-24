
const Model = require('./model');

class PostModel extends Model {
  constructor() { // eslint-disable-line
    super();
  }

  static getInstance() {
    return new PostModel();
  }
  /**
     *
     * @param  Array categoriesId
     * @param  Int  limit
     * @description get random post
     * @return Array
     */
  async getSamplePost(categoriesId) { // eslint-disable-line
    try {
      const requestQuery = await this.aggregate({
        collection: 'post',
        args: [
          { $match: { category_id: { $in: this.getObjectId(categoriesId) } } },
          { $sample: { size: 1 } },
        ],
      });
      return requestQuery;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = PostModel;
