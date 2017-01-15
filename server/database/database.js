var MongoClient = require('mongodb').MongoClient;
var utils = require('../misc/utils');
var environment = require('../config/environment');

let _db = null;
let linksCollection = null;
let statsCollection = null;

module.exports = {
  init: () => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(environment.mongoUrl, (err, db) => {
        if (err) {
          console.error('Failed to connect to DB:', err);
          reject(err);
        } else {
          _db = db;
          linksCollection = db.collection('linksCollection');
          statsCollection = db.collection('statsCollection');
          resolve();
        }
      });
    })
  },

  insertLinks: (links) => {
    links.map(link => linksCollection.update(
      { linkId: link.linkId },
      link,
      { upsert: true }
    ));
  },

  findLink: (linkId) => {
    return linksCollection.findOne({ linkId })
    .then(link => {
      if (!link) {
        throw new Error('Could not find link with id: ', linkId)
      } else {
        return link;
      }
    });
  },

  close: () => {
    console.log('Closing Database');
    _db && _db.close();
  },

  incrementVisitCount: () => {
    const today = utils.getDate();

    statsCollection.update(
       { date: today },
       { $inc: { visits: 1 } },
       { upsert: true }
    )
  },

  getFreshestLink: (category) => {
    if (category) {
      return linksCollection.find({ category }).sort({ categoryIndex: -1 }).limit(1);
    }
    return linksCollection.find().sort({ totalIndex: -1 }).limit(1);
  },

  getBatch: (index, category) => {
    if (category) {
      return linksCollection.find({
        $and: [
          { category },
          { categoryIndex: { $lte: index } }
        ]
      }).limit(6);
    } else {
      return linksCollection.find({ totalIndex: { $lte: index } }).limit(6);
    }
  }
}
