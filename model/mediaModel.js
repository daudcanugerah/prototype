const Model = require('./model');

class MediaModel extends Model {
  constructor() {
    super();
  }

  static getInstance() {
    return new MediaModel();
  }

  /**
   * @method addMedia()
   * @param Object detail
   * @desc menambah media
   * @return Promises
   */

  async addMedia({ detailMedia }) {
    try {
      const request = await this.insertOne({
        collection: 'media',
        args: [
          {
            detail_media: detailMedia,
            is_used: false,
            created_at: new Date(),
            updated_at: new Date(),
          }],
      });
      return request.ops;
    } catch (err) {
      throw err;
    }
  }

  /**
   * @method updateMediaChanel()
   * @param String mediaId
   * @param Object detailChanel
   * @desc menambah media
   * @return Promises
   */

  async updateMediaChanel({ mediaId, detailChanel }) {
    try {
      const request = await this.updateOne({
        collection: 'media',
        args: [
          {
            _id: this.getObjectId(mediaId),
          },
          {
            $push: { detail_chanel: detailChanel },
            is_used: true,
            created_at: new Date(),
            updated_at: new Date(),
          }],
      });
      return request;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = MediaModel;
