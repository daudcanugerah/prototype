const { getDb } = require('../libs/database');

const DEFAULT_COLLECTION = 'account';

function getAccount($id) {

}

module.exports.getAccounts = async (...args) => {
    try {
        let db = await getDb();
        let request = await db.collection(DEFAULT_COLLECTION).find(...args);
        return request.toArray();
    } catch (err) {
        console.log(err);
    }
}

module.exports.getPagiAccounts = async (skip, limit) => {
    try {
        let db = await getDb();
        let request = await db.collection(DEFAULT_COLLECTION).find({ skip, limit });
        return request.toArray();
    } catch (err) {
        console.log(err);
    }
}

module.exports.setCredential = async (data) => {
    try {
        let db = await getDb();
        let userExist = await this.getAccounts({
            id_str: data.id_str
        });
        if (userExist) {
            let request = await db.collection(DEFAULT_COLLECTION).updateOne({ id_str: data.id_str }, { $set: { ...data} }, { upsert: true });
        }else{
            let request = await db.collection(DEFAULT_COLLECTION).insertOne(data);
        }
    } catch (err) {
        console.log(err);
    }
}