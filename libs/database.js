const { MongoClient } = require('mongodb');
var _db;

let connect = async () => {
    try {
        const client = new MongoClient(process.env.DB_URL, { useNewUrlParser: true });
        try {
            await client.connect();
            let db = client.db(process.env.DB_NAME);
            console.log('Database Running');
            return _db = db;
        } catch (err) {
            console.log(err.message);
        }
    } catch (err) {
        console.log('Db Error ' + err);
    }
};

let getDb = () => {
    return _db;
}

module.exports = { connect, getDb }
