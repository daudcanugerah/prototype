const { validationResult } = require('express-validator/check');
const Model = require('./../model/mediaModel').getInstance();

class Media {
  upload() {
    return async (req, res) => {
      // check validation error by express-validator
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      // check file upload
      const { files } = req;
      if (!files) {
        res.sendStatus(422).json('error uploading file');
      }
      const addMedia = await Model.addMedia({ detailMedia: files[0] });
      return res.json({ id: addMedia[0]._id.toString() });
    };
  }
}

module.exports = new Media();
