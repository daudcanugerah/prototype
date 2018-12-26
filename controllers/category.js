const categoryModel = require('./../model/categoryModel').getInstance();
const model = require('./../model/model').getInstance();
const { isset } = require('./../libs/helper');
const authModel = require('./../model/authModel').getInstance();
const { validationResult } = require('express-validator/check');

class Category {
  index() {
    return async (req, res) => {
      const { username } = await authModel.getUserInfo(req.session.userId);
      res.render('category/index', { linkTarget: 'category', username });
    };
  }

  addCategoryJX() {
    return async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      try {
        await categoryModel.addCategory(req.body.name);
        return res.send(200);
      } catch (err) {
        throw err;
      }
    };
  }

  getCategoryJX() {
    return async (req, res) => {
      const categoryId = isset(req.body.categoryId) ? req.body.categoryId : null;
      try {
        const data = await categoryModel.getCategory(categoryId);
        res.send(data);
      } catch (err) {
        throw (err);
      }
    };
  }

  getCategoryDTLS() {
    return async (req, res) => {
      const { draw } = req.query;
      const start = Number(req.query.start);
      const recordTotal = Number(await model.count({ collection: 'category', args: [{}] }));
      const length = req.query.length <= 0 ? recordTotal : Number(req.query.length);


      const data = [];
      const schedule = await model.aggregate({
        collection: 'category',
        args: [
          {
            $skip: start,
          },
          {
            $limit: length,
          },
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
              editable: 1,
              type: { $cond: { if: { $eq: ['$editable', false] }, then: 'APP Defined', else: 'USER Defined' } },
              post: { $size: '$posts' },
            },
          },
        ],
      });


      let no = 0;
      const scheduleData = await schedule.toArray();
      scheduleData.forEach((item) => {
        data.push([
          ((no += 1) + start),
          item.name,
          item.post,
          item.created_at,
          item.type,
          `<button class='btn btn-sm btn-primary'><i class="fas fa-eye"></i></button>&nbsp;
          ${item.editable
    ? `<button class='btn btn-sm btn-primary' onClick='updateCategory(${JSON.stringify(item).toString()})'><i class="fas fa-edit"></i></button>&nbsp
      <button class='btn btn-sm btn-primary' onClick='deleteCategory("${item._id}")'><i class="fas fa-trash"></i></button>` : ''
}`,
        ]);
      });

      const response = JSON.stringify({
        draw,
        recordTotal,
        recordsFiltered: recordTotal,
        data,
      });
      res.send(response);
    };
  }

  deleteCategoryJX() {
    return async (req, res) => {
      const { categoryId } = req.body;
      try {
        const request = await categoryModel.deleteCategory(categoryId);
      } catch (err) {
        throw err;
      }
      res.json(true);
    };
  }

  updateCategoryJX() {
    return async (req, res) => {
      const { categoryId, name } = req.body;
      try {
        await categoryModel.updateCategory({ categoryId, name });
        return res.json({ code: 200, message: 'success' });
      } catch (err) {
        throw err;
      }
    };
  }
}

module.exports = new Category();
