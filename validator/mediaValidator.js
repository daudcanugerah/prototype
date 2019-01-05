const { checkSchema } = require('express-validator/check');

class mediaValidator {
  static uploadImage() {
    return checkSchema({
      media: {
        /**
           * check max file size
           * image/jpg|png < 5mb
           * image/gif < 15mb
           * video/* < 512mb
           */
        custom: {
          options: (value, { req, location, path }) => {
            const file = req.files[0];
            const type = file.mimetype.split('/')[1];
            switch (true) {
              case (/(jpg|jpeg|webp|png)/).test(type):
                if ((file.size / ((1024 ** 2) ** 2) > 5)) {
                  throw new Error('ukuran file image harus kurang dari 5 mb');
                }
                return true;
                break;
              case (/(gif)/).test(type):
                if ((file.size / (1024 ** 2)) > 15) {
                  throw new Error('ukuran file gif harus kurang dari 15 mb');
                }
                return true;
                break;
              case (/(mp4|mov})/).test(type):
                if ((file.size / (1024 ** 2)) > 512) {
                  throw new Error('ukuran file video harus kurang dari 512 mb');
                }
                return true;
                break;
              default:
                throw new Error('file type not allowed');
                break;
            }
          },
        },
      },
    });
  }
}

module.exports = mediaValidator;
