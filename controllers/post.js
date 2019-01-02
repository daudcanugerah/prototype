const moment = require('moment');
const model = require('./../model/model').getInstance();

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

  addPostJX() {
    return async (req, res) => {
      // // let form = upload();
      // req.body.tweet = "daud anugerah";
      // req.check('tweet').not().isEmpty().withMessage("Tweets tidak boleh kosong");
      // // form.on('fileBegin', function (name, file) {
      // //     var fileType = file.type.split('/').pop();
      // //     file.path = form.uploadDir + "/" + Date.now() + '.' + fileType;
      // //     req.body.fileType = fileType;
      // // });
      // // req.checkBody('fileType').custom(v => {
      // //     if ((/\.(gif|jpg|jpeg|tiff|png)$/i).test(v)) throw new Error;
      // // }).withMessage("Error pisan");

      // const errors = validationResult(req);
      // if (!errors.isEmpty()) {
      //     console.log(errors.array());
      //     console.log(req.body);
      //     return res.status(422).json({ errors: errors.array() });
      // // }
      // console.log(req.local);
      res.send({ body: req.body, file: req.file });
    };
  }
}

module.exports = new Post();
