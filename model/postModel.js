
const Model = require('./model');

class PostModel {
    /**
     * 
     * @param  Array categoriesId
     * @param  Int  limit
     * @description get random post
     * @return Array
     */
    async getSamplePost({ categoriesId, limit }) {
        try {
            let requestQuery = await Model.find({
                category_id: { $in: [...categoriesId] }
            }).limit(limit);
            return requestQuery.toArray();
        } catch (err) {
            throw err;
        }
    }
}

module.exports = new PostModel;