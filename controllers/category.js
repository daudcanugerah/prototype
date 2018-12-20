const moment = require('moment');
const model = require('../model/model');
const { upload } = require('../libs/helper');

class Category {

    addCategoryJX() {
        return async (req, res, next) => {
            try {
                let request = await model.find({ collection: "category", name: req.body.name });
                let data = await request.toArray();
                if (data.length > 0) {
                    return res.send(403);
                }
                await model.insertOne({
                    collection: "category",
                    name: req.body.name,
                    editable: true,
                    created_at: new Date(),
                    updated_at: new Date()
                });
                return res.send(200);
            } catch (err) {
                throw err;
            }
        }
    }

    getCategoryJX() {
        return async (req, res, next) => {
            try {
                let request = await model.aggregate({
                    collection: "category", args: [
                        {
                            $lookup: {
                                from: 'post',
                                localField: '_id',
                                foreignField: 'category_id',
                                as: 'posts'
                            }
                        },
                        {
                            $project: {
                                name: 1,
                                created_at: 1,
                                updated_at: 1,
                                countArray: { $size: '$posts' }
                            }
                        }
                    ]
                });
                let data = await request.toArray();
                res.send(data);
            } catch (err) {
                throw (err);
            }
        }
    }
}

module.exports = new Category;