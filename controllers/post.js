const moment = require('moment');
const model = require('./../model/model');

class Post {
    /**
     *  Function Index
     */
    index() {
        return (req, res, next) => {
            res.render('post/index.ejs', { linkTarget: 'post' });
        }
    }

    /**
     *  Funtion GetPostDTLS
     *  @description mengambil data postingan dari model khusus untuk pemanggilan ajax
     *  @return JSON
     */
    getPostDTLS() {
        return async (req, res, next) => {

            let draw = req.query.draw;
            let start = Number(req.query.start);
            let recordTotal = Number(await model.count({ collection: 'post', args: {} }));
            let length = req.query.length <= 0 ? recordTotal : Number(req.query.length);
            let search = req.query.search;
            let order = req.query.order;


            let data = [];
            let post = await model.aggregate({
                collection: 'post', args: [
                    {
                        $skip: start,
                    },
                    {
                        $limit: length,
                    },
                    {
                        $lookup: {
                            from: "category",
                            localField: "_id.str",
                            foreignField: "category_id",
                            as: "categories"
                        },
                    },
                ]
            });


            let no = 0;
            let postData = await post.toArray();
            postData.forEach(item => {
                data.push([
                    ((++no) + start),
                    "**" + String(item._id).substr(20),
                    item.content,
                    item.media == null ? "Not Avaible" : item.media,
                    item.categories[0].name,
                    moment(item.updated_at).fromNow(),
                    item.status,
                    "<button class='btn btn-sm btn-primary'>Edit</button>"
                ]);
            });

            let response = JSON.stringify({
                draw: draw,
                recordTotal,
                recordsFiltered: recordTotal,
                data: data
            })
            res.send(response);
        }
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
        }
    }
}

module.exports = new Post;