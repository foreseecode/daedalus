const { MongoClient } = require("mongodb");
const { promisify } = require("util");

const DBUser = "api";
const DBPassword = "M4KgnR32";
const DBName = "mainDB";

module.exports = class MongoConnector {
  constructor() {}

  async init() {
    console.log("MongoDB init...");
    const localEndpoint = `mongodb://${DBUser}:${DBPassword}@localhost:27017/${DBName}`;

    this.client = await promisify(MongoClient.connect)(localEndpoint, {
      useNewUrlParser: true
    });
    this.db = this.client.db(DBName);
    console.log("MongoDB connection established");
  }

  /**
   * Insert an array of documents
   * @param {Array<Object>} data
   */
  async insertDocuments(data) {
    const collection = this.db.collection("respondents");

    // TODO: not sure why promisify isn't working
    // const result = await promisify(collection.insertMany)(data);
    // console.log('inserted respondent', result);
    // return result;

    return new Promise((resolve, reject) => {
      collection.insertMany(data, function(error, result) {
        if (error) return reject(error);

        console.log(data);
        console.log(result);
        resolve(result);
      });
    });
  }

  async findDocuments() {
    const collection = this.db.collection("respondents");
    // const result = await promisify(collection.find)({ c: 'ccc' });
    // const coll = collection.find({ c: 'ccc' });
    // const result = await promisify(coll.toArray)();
    // return result;

    return new Promise((resolve, reject) => {
      collection.find({ fidelity: "loyal" }).toArray((error, docs) => {
        error ? reject(error) : resolve(docs);
      });
    });
  }
};
