
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
      return requestQuery.toArray();
    } catch (err) {
      throw err;
    }
  }

  async add({ content, categoryId, media = null }) {
    try {
      const requestQuery = await this.insertOne({
        collection: 'post',
        args: [
          {
            content,
            $push: { media },
            category_id: categoryId,
          },
        ],
      });
      return requestQuery.toArray();
    } catch (err) {
      throw err;
    }
  }

  async update({
    postId, content, categoryId, media = null,
  }) {
    try {
      const requestQuery = await this.updateOne({
        collection: 'post',
        args: [
          { _id: postId },
          {
            content,
            $push: { media },
            category_id: categoryId,
          },
        ],
      });
      return requestQuery.toArray();
    } catch (err) {
      throw err;
    }
  }
}

module.exports = PostModel;
