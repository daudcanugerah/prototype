const { checkSchema } = require('express-validator/check');
const Model = require('../model/categoryModel').getInstance();

class categoryValidator {
  static addCategoryValidator() {
    return checkSchema({
      name: {
        in: ['body'],
        isLength: {
          options: { min: 7 },
          errorMessage: 'name should be at least 7 chars long',
        },
        isEmpty: {
          negated: true,
          errorMessage: 'name canot empty',
        },
        custom: {
          options: async (value, { req, location, path }) => {
            const exist = await Model.checkCategoryExist({ name: value });
            if (exist.length > 0) {
              return Promise.reject('E-mail already in use');
            }
          },
        },
      },
    });
  }
}

module.exports = categoryValidator;
