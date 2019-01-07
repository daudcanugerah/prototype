
// const Media = require('./mediaModel').getInstance();
// const Model = require('./model').getInstance();
// const { connect, closeConnection } = require('./../libs/database');

// describe('Media Model Test', () => {
//   let postId = null;
//   beforeAll(async (done) => {
//     // set env for db
//     process.env.DB_URL = 'mongodb://localhost:27017/automation';
//     // connection DB
//     await connect();
//     done();
//   });

//   beforeEach(async (done) => {
//     data = await Model.insertOne({
//       collection: 'post',
//       args: [
//         {
//           name: 'post testing',
//           category_id: Model.getObjectId('5c22054584528a1fd8a9aed0'),
//           created_at: Date(),
//           updated_at: Date(),
//         },
//       ],
//     });
//     postId = data.ops[0]._id.toString();
//     done();
//   });

//   afterAll((done) => {
//     closeConnection();
//     done();
//   });


//   test('should return a result when match', async (done) => {
//     const data = await Media.addMedia({
//       postId,
//       detailMedia: {
//         name: 'daud',
//       },
//     }).then(data => data.toArray());
//     expect(data).toHaveLength(1);
//     done();
//   });
// });
