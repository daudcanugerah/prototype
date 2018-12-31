const { MongoClient } = require('mongodb');

let _db;

const connect = async () => {
  try {
    const client = new MongoClient(process.env.DB_URL, { useNewUrlParser: true });
    try {
      await client.connect();
      const db = client.db(process.env.DB_NAME);
      console.log('Database Running');
      return _db = db;
    } catch (err) {
      throw err;
    }
  } catch (err) {
    console.log(`Db Error ${  err}`);
  }
};

const getDb = () => _db;

module.exports = { connect, getDb };
