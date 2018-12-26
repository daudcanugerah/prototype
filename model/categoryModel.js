const Model = require('./model');

class CategoryModel extends Model {
  constructor() {
    super();
  }

  static getInstance() {
    return new CategoryModel();
  }

  /**
   * @method addCategory()
   * @param String name
   * @desc menambah category
   * @return Promises
   */
  async addCategory(name) {
    try {
      const request = await this.insertOne({
        collection: 'category',
        args: [{
          name,
          editable: true,
          created_at: new Date(),
          updated_at: new Date(),
        }],
      });
      return request;
    } catch (err) {
      throw err;
    }
  }

  /**
   * @method updateCategory()
   * @param Object name -> String |
   * @desc update category
   * @return Promises
   */
  async updateCategory({ categoryId, name }) {
    try {
      const request = await this.updateOne({
        collection: 'category',
        args: [
          { _id: this.getObjectId(categoryId) },
          {
            $set: {
              name,
              updated_at: Date(),
            },
          },
        ],
      });
      return request;
    } catch (err) {
      throw err;
    }
  }

  /**
   * @method deleteCategory()
   * @param String CategoryId
   * @desc menghapus category berdasarkan id
   * @return Promises
   */
  async deleteCategory(categoryId) {
    try {
      const request = await this.updateOne({ collection: 'category', args: [{ _id: this.getObjectId(categoryId) }, { $set: { deleted_at: Date() } }] });
      return request;
    } catch (err) {
      throw err;
    }
  }

  /**
   * @method checkCategoryExist()
   * @param Object name -> string
   * @desc mengecek category yang sama berdasarkan nama category
   * @return Promises Array
   */
  async checkCategoryExist({ name }) {
    try {
      const data = await this.find({ collection: 'category', args: [{ name, deleted_at: { $exists: false } }] });
      return data.toArray();
    } catch (err) {
      throw err;
    }
  }

  /**
   * @method getCategory();
   *  @param String CategryId
   *  @description mendapatkan data category dengan referansinya, semua atau bersdasarkan categoryId.
   *  @return Promises Array
   */
  async getCategory(categoryId) {
    try {
      const request = await this.aggregate({
        collection: 'category',
        args: [
          // categoryId ? { _id: this.getObjectId(categoryId) } : {},
          { $match: { deleted_at: { $exists: false } } },
          {
            $lookup: {
              from: 'post',
              localField: '_id',
              foreignField: 'category_id',
              as: 'posts',
            },
          },
          {
            $project: {
              name: 1,
              created_at: 1,
              updated_at: 1,
              countArray: { $size: '$posts' },
            },
          },
        ],
      });
      return request.toArray();
    } catch (err) {
      throw err;
    }
  }
}


module.exports = CategoryModel;
