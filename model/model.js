const { getDb } = require('./../libs/database');

class Model {
    static async find({ collection, args }) {
        try {
            let db = await getDb();
            let request = await db.collection(collection).find(args.args);
            return request;
        } catch (err) {
            throw err;
        }
    }

    static async aggregate({ collection, ...args }) {
        try {
            let db = await getDb();
            let request = await db.collection(collection).aggregate(args.args);
            return request;
        } catch (err) {
            throw err;
        }
    }


    static async count({ collection, ...args }) {
        try {
            let db = await getDb();
            let request = await db.collection(collection).count(args.args);
            return request;
        } catch (err) {
            throw err;
        }
    }

    static async insertOne({ collection, args }) {
        try {
            let db = await getDb();
            let request = await db.collection(collection).insertOne(...args);
            console.log(request);
        } catch (err) {
            throw err;
        }
    }

    static async updateMany({ collection, args }) {
        try {
            let db = await getDb();
            let request = await db.collection(collection).updateMany(...args);
            console.log(request);
        } catch (err) {
            throw err;
        }
    }

}

module.exports = Model;
