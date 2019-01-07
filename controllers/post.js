const moment = require('moment');
const model = require('./../model/model').getInstance();
const { validationResult } = require('express-validator/check');

class Post {
  /**
     *  Function Index
     */
  index() {
    return async (req, res) => {
      res.render('post/index.ejs', { linkTarget: 'post' });
    };
  }

  /**
     *  Funtion GetPostDTLS
     *  @description mengambil data postingan dari model khusus untuk pemanggilan ajax
     *  @return JSON
     */
  getPostDTLS() {
    return async (req, res) => {
      const draw = req.query.draw;
      const start = Number(req.query.start);
      const recordTotal = Number(await model.count({ collection: 'post', args: [{}] }));
      const length = req.query.length <= 0 ? recordTotal : Number(req.query.length);
      const search = req.query.search;
      const order = req.query.order;


      const data = [];
      const post = await model.aggregate({
        collection: 'post',
        args: [
          {
            $skip: start,
          },
          {
            $limit: length,
          },
          {
            $lookup: {
              from: 'category',
              localField: '_id.str',
              foreignField: 'category_id',
              as: 'categories',
            },
          },
        ],
      });


      let no = 0;
      const postData = await post.toArray();
      postData.forEach((item) => {
        data.push([
          ((no += 1) + start),
          `**${String(item._id).substr(20)}`,
          item.content,
          item.media == null ? 'Not Avaible' : item.media,
          item.categories[0].name,
          moment(item.updated_at).fromNow(),
          item.status,
          "<button class='btn btn-sm btn-primary'>Edit</button>",
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

  add() {
    return async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      // updateMedia();
    };
  }
}

module.exports = new Post();
