

const CronJob = require('cron').CronJob;
const oauth = require('oauth');

const runCron = function () { // eslint-disable-line



  // let cron = {};
  // let dbRequest = await DB.find({ collection: 'schedule', args: [{}] });
  // let tasks = await dbRequest.toArray();
  // // convert cron
  // for (let i = 0; i < tasks.length; i++) {
  //     tasks[i]["time"] = getCronFormat(tasks[i].time);
  // }

  // tasks.forEach(item => {
  //     activeCron[item._id] = (() => {
  // return new CronJob("* * * * * *",async function () {
  // try{
  //     const oa = new oauth();
  //     oa.oa.get(
  //         'https://api.twitter.com/1.1/trends/place.json?id=23424977',                        '833876684352868352-ogYz8aqkq2bviR4tSkNgdBcdPw4f0y8',
  //         '6QN3iwiv59jZnbwqWX7FOtxcSGBdzl9WEaDRCYjHreYpC',
  //         (error,response) => {
  //           console.log(response,error);
  //     });
  // }catch(err){
  //     console.log(err);
  // }
  //         });
  //     })();
  // });
  // startCron();
  // return cron;
};

// let startCron = function (id = null) {
//     if (isset(id)) {
//         try {
//             if (isset(activeCron[id])) {
//                 activeCron[id].start();
//                 return true;
//             } else {
//                 return false;
//             }
//         } catch (err) {
//             console.log(err);
//         }
//     } else {
//         try {
//             for (const key in activeCron) {
//                 activeCron[key].start();
//             }
//             return true;
//         } catch{
//             throw err;
//         }
//     }
// }
// let stopCron = function (id = null) {
//     if (isset(id)) {
//         try {
//             if (isset(activeCron[id])) {
//                 activeCron[id].stop();
//                 return true;
//             } else {
//                 return false;
//             }
//         } catch (err) {
//             console.log(err);
//         }
//     } else {
//         try {
//             for (const key in activeCron) {
//                 activeCron[key].stop();
//             }
//             return true;
//         } catch{
//             return false;
//         }
//     }
// }
// let getNexDate = (id, priode = 1) => {
//     try {
//         if (isset(activeCron[id])) {
//             let data = activeCron[id].nextDates(1);
//             return data[0]._d;
//         } else {
//             return false;
//         }
//     } catch (err) {
//         console.log(err);
//     }
// }
// let getInstance = (id) => {
//     try {
//         if (isset(activeCron[id])) {
//             return activeCron[id];
//         } else {
//             return false;
//         }
//     } catch (err) {
//         console.log(err);
//     }
// }

module.exports = { runCron };
