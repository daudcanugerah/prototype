const {getCronFormat} = require('./../libs/helper');
const Model = require('./../model/model');
const CronJob = require('cron').CronJob;
const {isset} = require('./helper');
const Engine =require('./engine');
const DB = new Model();

var activeCron = {};

const runCron = async function () { 
  let cron = {};
  let dbRequest = await DB.find({ collection: 'schedule', args: [{}] });
  let tasks = await dbRequest.toArray();
  if(tasks.length > 0){
  // convert cron
  for (let i = 0; i < tasks.length; i++) {
    tasks[i]["time"] = getCronFormat(tasks[i].time);
}

  tasks.forEach(item => {
      activeCron[item._id] = (() => {
      return new CronJob(item.time,async function () {
        console.log('cron job runnint '+ Date())
          let engine = new Engine(item);
          engine.runEngine();
        });
      })();
  });
  return cron;
};

let startCron = function (id = null) {
    if (isset(id)) {
        try {
            if (isset(activeCron[id])) {
                activeCron[id].start();
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.log(err);
        }
    } else {
        try {
            for (const key in activeCron) {
                activeCron[key].start();
            }
            return true;
        } catch(err){
            throw err;
        }
    }
}

let stopCron = function (id = null) {
    if (isset(id)) {
        try {
            if (isset(activeCron[id])) {
                activeCron[id].stop();
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.log(err);
        }
    } else {
        try {
            for (const key in activeCron) {
                activeCron[key].stop();
            }
            return true;
        } catch{
            return false;
        }
    }
}
let getNexDate = (id, priode = 1) => {
    try {
        if (isset(activeCron[id])) {
            let data = activeCron[id].nextDates(1);
            return data[0]._d;
        } else {
            return false;
        }
    } catch (err) {
        console.log(err);
    }
}
let getInstance = (id) => {
    try {
        if (isset(activeCron[id])) {
            return activeCron[id];
        } else {
            return false;
        }
    } catch (err) {
        console.log(err);
    }
}

module.exports = { runCron,getNexDate,getInstance };
