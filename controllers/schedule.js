const model = require('./../model/model');
const { isset } = require('./../libs/helper');
const cronstrue = require('cronstrue');
const { ObjectId } = require('mongodb');
const Moment = require('moment');
const { getNexDate, getInstance } = require('./../libs/cron');

module.exports = {
    add: function (req, res) {
        return (req, res) => {
            res.render('schedule/add.ejs', { linkTarget: 'schedule', className: 'minute' });
        }
    },

    addAction: function () {
        return async (req, res, next) => {
            let time = this.extractForm(req.body.time);
            let { name, category_id, schedule, account } = req.body;

            // nomalkan bentukk category_id, dari array menjadi array object 
            category_id.forEach((item, i) => { category_id[i] = { _id: ObjectId(item) } });

            try {
                let request = await model.insertOne({ collection: "schedule", args: [{ name, type: ['post'], account, category_id, time: [time] }] });
            } catch (err) {
                console.log(err);
            }
            res.json(req.body);
        }
    },

    extractForm: function (data) {
        let newa = {};
        for (const object in data) {
            newa[object] = {};
            for (const key in data[object]) {
                let temp = data[object][key];
                if (key == "range") {
                    newa[object][key] = [];
                    for (let i = 0; i < temp['from'].length; i++) {
                        newa[object][key].push([temp['from'][i], temp['to'][i]]);
                    }
                } else {
                    newa[object][key] = temp;
                }
            }
        }
        return newa;
    },
    converToCron: function (data, name) {
        if (isset(data[name])) {
            let result = "";
            let object = data[name];
            for (const key in object) {
                switch (key) {
                    case 'range':
                        for (let i = 0; i < object[key].length; i++) {
                            result += `${object[key][i][0]}-${object[key][i][1]},`;
                        }
                        break;
                    case 'multiples':
                        object[key].forEach(item => {
                            result += `${item},`
                        });
                        break;
                    case 'step':
                        object[key].forEach(item => {
                            result += `*/${item},`
                        });
                        break;
                }
            }
            return result.substr(0, result.length - 1);
        } else {
            return '*';
        }
    },
    getScheduleDTLS: function () {
        return async (req, res, next) => {
            let draw = req.query.draw;
            let start = Number(req.query.start);
            let recordTotal = Number(await model.count({ collection: 'schedule', args: {} }));
            let length = req.query.length <= 0 ? recordTotal : Number(req.query.length);
            let search = req.query.search;
            let order = req.query.order;


            let data = [];
            let schedule = await model.aggregate({
                collection: 'schedule', args: [
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
                            as: 'categories'
                        }
                    }
                ]
            });


            let no = 0;
            let scheduleData = await schedule.toArray();
            console.log(scheduleData);
            scheduleData.forEach(item => {
                data.push([
                    ((++no) + start),
                    item.name,
                    Date(getNexDate(item._id)),
                    this.getCategory(item.categories),
                    item.account,
                    getInstance(item._id).running ? 'running' : 'stopped',
                    `<button class='btn btn-sm btn-primary'><i class="fas fa-info-circle"></i> Info</button>&nbsp;
                    <button class='btn btn-sm btn-primary' onClick="toggleService('${item._id}','${getInstance(item._id).running}')"><i class="fas ${getInstance(item._id).running ? 'fa-stop' : 'fa-play'}"></i></button>
                    `
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
    },

    getCategory: function (categories) {
        for (let i = 0; i < categories.length; i++) {
            return `<span class="badge badge-secondary">${categories[i].name}</span>`;
        }
    },
    index: function () {
        return async (req, res, next) => {
            res.render('schedule/index.ejs', { linkTarget: 'schedule' });
        }
    }

}
