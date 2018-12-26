const { getCronFormat } = require('./../libs/helper');
const Model = require('./../model/model');
const CronJob = require('cron').CronJob;
const { isset } = require('./helper');
const Engine = require('./engine');

const DB = new Model();

const activeCron = {};

const runCron = async () => {
  const cron = {};
  const dbRequest = await DB.find({ collection: 'schedule', args: [{}] });
  const tasks = await dbRequest.toArray();
  if (tasks.length > 0) {
  // convert cron
    for (let i = 0; i < tasks.length; i++) {
      tasks[i].time = getCronFormat(tasks[i].time);
    }

    tasks.forEach((item) => {
      activeCron[item._id] = (() => new CronJob(item.time, (async () => {
        console.log(`cron job runnint ${Date()}`);
        const engine = new Engine(item);
        engine.runEngine();
      })))();
    });
    return cron;
  }
};

const startCron = (id = null) => {
  if (isset(id)) {
    try {
      if (isset(activeCron[id])) {
        activeCron[id].start();
        return true;
      }
      return false;
    } catch (err) {
      console.log(err);
    }
  } else {
    try {
      for (const key in activeCron) {
        activeCron[key].start();
      }
      return true;
    } catch (err) {
      throw err;
    }
  }
};

const stopCron =  (id = null) => {
  if (isset(id)) {
    try {
      if (isset(activeCron[id])) {
        activeCron[id].stop();
        return true;
      }
      return false;
    } catch (err) {
      console.log(err);
    }
  } else {
    try {
      for (const key in activeCron) {
        activeCron[key].stop();
      }
      return true;
    } catch (err) {
      return ferr;
    }
  }
};
const getNexDate = (id, priode = 1) => {
  try {
    if (isset(activeCron[id])) {
      const data = activeCron[id].nextDates(1);
      return data[0]._d;
    }
    return false;
  } catch (err) {
    console.log(err);
  }
};
const getInstance = (id) => {
  try {
    if (isset(activeCron[id])) {
      return activeCron[id];
    }
    return false;
  } catch (err) {
    console.log(err);
  }
};

module.exports = { runCron, getNexDate, getInstance };
