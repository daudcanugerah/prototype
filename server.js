// require('dotenv').config();
// const request = require('request');

// const options = {
//   consumer_key: 'smYhmOzlJzNbqq6KTcChsKVQs',
//   consumer_secret: 'WFCJmWgVMJjNvnqGpTzZfLZMK9bYt77miiKdy1ThQO8NbwgzDS',
//   token: '833876684352868352-ogYz8aqkq2bviR4tSkNgdBcdPw4f0y8',
//   token_secret: '6QN3iwiv59jZnbwqWX7FOtxcSGBdzl9WEaDRCYjHreYpC',
// };
// const tw = request.post({ url: 'https://api.twitter.com/1.1/statuses/update.json?status=I Have New Toy', oauth: options }, (e, r, data) => {
//   let json = JSON.parse(data);
//   console.log(json);
// });

// Promise.seriousRace = function(promises) { //eslint-disable-line
//   const indexPromises = promises.map((p, index) => p.catch(() => {
//     console.log(`index${index}`);
//     throw index;
//   }));
//   console.log(indexPromises);
//   return Promise.race(indexPromises).catch(index => { //eslint-disable-line
//     const p = promises.splice(index, 1)[0];
//     p.catch(e => console.log(`${e} terjatuh,ahh sudahlah lanjutkan saja`));
//     return Promise.seriousRace(promises);
//   });
// };


// const peserta1 = new Promise(resolve => setTimeout(resolve, 30, 'Peserta 1'));
// const peserta2 = new Promise((resolve, reject) => setTimeout(reject, 20, 'Peserta 2'));
// const peserta3 = new Promise(resolve => setTimeout(resolve, 50, 'Peserta 3'));
// const peserta4 = new Promise(resolve => setTimeout(resolve, 100, 'Peserta 4'));
// const peserta5 = new Promise(resolve => setTimeout(resolve, 90, 'Peserta 5'));

// Promise.seriousRace([peserta1, peserta2, peserta3, peserta4, peserta5])
//   .then(val => console.log('Balapan selesai,Pemenangnya adalah:', val))
//   .catch(err => console.log('Balapan dihentikan karena : ', err));
