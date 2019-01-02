const { checkSchema } = require('express-validator/check');
const { extractForm, getCronFormat } = require('./../libs/helper');
const CronJob = require('cron').CronJob;
const Model = require('../model/scheduleModel').getInstance();

class scheduleValidator {
  static addScheduleValidator() {
    return checkSchema({
      name: {
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
            const exist = await Model.checkScheduleExist({ name: value });
            if (exist.length > 0) {
              return Promise.reject('name already exists');
            }
          },
        },
      },
      time: {
        custom: {
          options: async (value) => {
            try {
              const cron = getCronFormat(extractForm(value));
              new CronJob(cron, () => {
                console.log('a');
              });
            } catch (e) {
              return Promise.reject('Cron Format Not Valid');
            }
            const exist = await Model.checkScheduleExist({
              cronFormat: getCronFormat(extractForm(value)),
            });
            if (exist.length > 0) {
              return Promise.reject('Schedule Already exist');
            }
            // check cron valid?
          },
        },
      },
      categoryId: {
        isEmpty: {
          errorMessage: 'category canot empty',
          negated: true,
        },
      },
      account: {
        isLength: {
          errorMessage: 'account canot empty',
          options: {
            min: 1,
          },
        },
      },
    });
  }

  static update() {
    return checkSchema({
      name: {
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
            const exist = await Model.checkScheduleExist({ name: value });
            if (exist.length > 0) {
              return Promise.reject('name already exists');
            }
          },
        },
      },
      categoryId: {
        isEmpty: {
          errorMessage: 'category canot empty',
          negated: true,
        },
      },
      scheduleId: {
        isEmpty: {
          errorMessage: 'schduleId canot empty',
          negated: true,
        },
      },
      account: {
        isLength: {
          errorMessage: 'account canot empty',
          options: {
            min: 1,
          },
        },
      },
    });
  }
}

module.exports = scheduleValidator;
