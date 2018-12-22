const { ObjectId } = require('mongodb');
const { isset } = require('./../libs/helper');
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
      const time = this.extractForm(req.body.time);
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

  extractForm(data) {
    const newa = {};
    for (const object in data) { //eslint-disable-line
      newa[object] = {};
      for (const key in data[object]) { //eslint-disable-line
        const temp = data[object][key];
        if (key === 'range') {
          newa[object][key] = [];
          for (let i = 0; i < temp.from.length; i++) { //eslint-disable-line
            newa[object][key].push([temp.from[i], temp.to[i]]);
          }
        } else {
          newa[object][key] = temp;
        }
      }
    }
    return newa;
  },
  converToCron(data, name) {
    if (isset(data[name])) {
      let result = '';
      const object = data[name];
      for (const key in object) { //eslint-disable-line
        switch (key) { //eslint-disable-line
          case 'range':
            for (let i = 0; i < object[key].length; i++) { //eslint-disable-line
              result += `${object[key][i][0]}-${object[key][i][1]},`;
            }
            break;
          case 'multiples':
            object[key].forEach((item) => { //eslint-disable-line
              result += `${item},`;
            });
            break;
          case 'step':
            object[key].forEach((item) => { //eslint-disable-line
              result += `*/${item},`;
            });
            break;
        }
      }
      return result.substr(0, result.length - 1);
    }
    return '*';
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
      console.log(scheduleData);
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
      res.render('schedule/index.ejs', { linkTarget: 'schedule' });
    };
  },

};
