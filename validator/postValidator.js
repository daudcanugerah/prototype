const { checkSchema } = require('express-validator/check');
const media = require('./../model/mediaModel').getInstance();

class postValidator {
  static add() {
    return checkSchema({
      content: {
        isLength: {
          options: {
            min: 10,
            max: 280,
          },
        },
      },
      category: {
        isEmpty: {
          negated: true,
        },
        isMongoId: true,
      },
      media: {
        custom: {
          options: async (value, { req, location, path }) => {
            // check image
            if (value.length > 1) {
              value.forEach(async (e) => {
                const file = await media.getMedia(e);
                const type = file.detail_media.mimetype.split('/')[1];
                if (!(/(jpg|jpeg|webp|png)/).test(type)) {
                  throw new Error('Type Not Allowed');
                }
              });
            } else if (value.length === 0) {
              throw new Error('file not empty');
            } else {
              const file = await media.getMedia(value);
              const type = file.detail_media.mimetype.split('/')[1];
              if (!(/(mp4|mov|gif|jpg|jpeg|webp|png)/).test(type)) {
                throw new Error('Type Not Allowed');
              }
            }
          },
        },
      },
    });
  }
}

module.exports = postValidator;
