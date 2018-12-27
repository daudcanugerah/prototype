const { ObjectId } = require('mongodb');
const { extractForm, getCronFormat } = require('./../libs/helper');
const DB = require('./../model/model');
const { getNexDate, getInstance } = require('./../libs/cron');
const { validationResult } = require('express-validator/check');
const ModelSchedule = require('./../model/scheduleModel').getInstance();
const Moment = require('moment');

const model = new DB();

module.exports = {
  add() {
    return (req, res) => {
      res.render('schedule/add.ejs', { linkTarget: 'schedule', className: 'minute' });
    };
  },

  addAction() {
    return async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      const time = extractForm(req.body.time);
      const {
        name, category_id, schedule, account,
      } = req.body;

      // nomalkan bentukk category_id, dari array menjadi array object
      category_id.forEach((item, i) => { category_id[i] = { _id: ObjectId(item) }; });

      try {
        await model.insertOne({
          collection: 'schedule',
          args: [{
            name, type: ['post'], account, category_id, time: [time], format: getCronFormat(time),
          }],
        });
      } catch (err) {
        console.log(err);
      }
      return res.redirect('/app/schedule');
    };
  },

  getScheduleDTLS() {
    return async (req, res) => {
      const { draw } = req.query;
      const start = Number(req.query.start);
      const recordTotal = Number(await model.count({ collection: 'schedule', args: [{}] }));
      const length = req.query.length <= 0 ? recordTotal : Number(req.query.length);


      const data = [];
      const schedule = await model.aggregate({
        collection: 'schedule',
        args: [
          { $match: { deleted_at: { $exists: false } } },
          {
            $skip: start,
          },
          {
            $limit: length,
          },
          {
            $lookup: {
              from: 'category',
              localField: 'category_id._id',
              foreignField: '_id',
              as: 'categories',
            },
          },
        ],
      });


      let no = 0;
      const scheduleData = await schedule.toArray();
      scheduleData.forEach((item) => {
        let momentDate = Moment(getInstance(item._id).nextDates(1)[0]._d);
        data.push([
          ((no += 1) + start),
          item.name,
          momentDate.format("YYYY-MM-DD HH:mm:ss"),
          this.getCategory(item.categories),
          item.account,
          getInstance(item._id).running ? 'running' : 'stopped',//eslint-disable-line
          `<button class='btn btn-sm btn-primary'><i class="fas fa-info-circle"></i> Info</button>&nbsp; 
                    <button class='btn btn-sm btn-primary' onClick="toggleService('${item._id}','${getInstance(item._id).running}')"><i class="fas ${getInstance(item._id).running ? 'fa-stop' : 'fa-play'}"></i></button>
                    <button class='btn btn-sm btn-primary' onClick="deleteSchedule('${item._id}')"><i class="fas fa-trash    "></i></button>
                    `,
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
  },

  getCategory(categories) { //eslint-disable-line
    for (let i = 0; i < categories.length; i += 1) {
      return `<span class="badge badge-secondary">${categories[i].name}</span>`;
    }
  },
  index() {
    return async (req, res) => {
      res.render('schedule/index.ejs', { linkTarget: 'schedule' });
    };
  },

  deleteJX() {
    return async (req, res) => {
      const { scheduleId } = req.body;
      try {
        await ModelSchedule.deleteSchedule(scheduleId);
      } catch (err) {
        throw err;
      }
      res.json(true);
    };
  },
};
