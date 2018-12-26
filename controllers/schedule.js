const { ObjectId } = require('mongodb');
const { extractForm } = require('./../libs/helper');
const DB = require('./../model/model');
const { getNexDate, getInstance } = require('./../libs/cron');

const model = new DB();

module.exports = {
  add() {
    return (req, res) => {
      res.render('schedule/add.ejs', { linkTarget: 'schedule', className: 'minute' });
    };
  },

  addAction() {
    return async (req, res) => {
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
            name, type: ['post'], account, category_id, time: [time],
          }],
        });
      } catch (err) {
        console.log(err);
      }
      res.json(req.body);
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
        data.push([
          ((no += 1) + start),
          item.name,
          Date(getNexDate(item._id)),//eslint-disable-line
          this.getCategory(item.categories),
          item.account,
          getInstance(item._id).running ? 'running' : 'stopped',//eslint-disable-line
          `<button class='btn btn-sm btn-primary'><i class="fas fa-info-circle"></i> Info</button>&nbsp; 
                    <button class='btn btn-sm btn-primary' onClick="toggleService('${item._id}','${getInstance(item._id).running}')"><i class="fas ${getInstance(item._id).running ? 'fa-stop' : 'fa-play'}"></i></button>
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
      // const auth = await authModel.getUserInfo(req.session.idUser);
      res.render('schedule/index.ejs', { linkTarget: 'schedule', username: 'daud' });
    };
  },

};
