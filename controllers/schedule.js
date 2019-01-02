const { ObjectId } = require('mongodb');
const { extractForm, isset, getCronFormat } = require('./../libs/helper');
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
        name, categoryId, account,
      } = req.body;

      // nomalkan bentukk category_id, dari array menjadi array object
      categoryId.forEach((item, i) => { categoryId[i] = { _id: ObjectId(item) }; });

      try {
        await model.insertOne({
          collection: 'schedule',
          args: [{
            name, type: ['post'], account, category_id: categoryId, time: [time], format: getCronFormat(time),
          }],
        });
      } catch (err) {
        throw (err);
      }
      return res.redirect('/app/schedule');
    };
  },
  getSchedule() {
    return async (req, res) => {
      try {
        const data = await ModelSchedule.getSchedule({
          id: isset(req.body.id) ? req.body.id : null,
          deleted: isset(req.body.deleted),
        });
        res.json(data);
      } catch (e) {
        throw e;
      }
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
        const momentDate = Moment(getInstance(item._id).nextDates(1)[0]._d);
        data.push([
          ((no += 1) + start),
          item.name,
          momentDate.format('YYYY-MM-DD HH:mm:ss'),
          this.getCategory(item.categories),
          item.account,
          getInstance(item._id).running ? 'running' : 'stopped',//eslint-disable-line
          `<button class='btn btn-sm btn-primary'><i class="fas fa-info-circle"></i> Info</button>&nbsp; 
                    <button class='btn btn-sm btn-primary' onClick="toggleService('${item._id}','${getInstance(item._id).running}')"><i class="fas ${getInstance(item._id).running ? 'fa-stop' : 'fa-play'}"></i></button>
                    <button class='btn btn-sm btn-primary' onClick='updateSchedule(${JSON.stringify({ id: item._id })})'><i class="fas fa-pencil-alt    "></i></button>
                    <button class='btn btn-sm btn-primary' onClick="deleteSchedule('${item._id}')"><i class="fas fa-trash  "></i></button>
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
    let result = '';
    for (let i = 0; i < categories.length; i += 1) {
      result += `<span class="badge badge-secondary">${categories[i].name}</span>&nbsp;`;
    }
    return result;
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
  update(jx = false) {
    return async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      const {
        account, categoryId, name, scheduleId,
      } = req.body;
      try {
        await ModelSchedule.updateSchedule({
          scheduleId,
          name,
          account,
          categoryId,
          type: ['post'],
        });
        res.json(200);
      } catch (e) {
        throw (e);
      }
    };
  },
};
