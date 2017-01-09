var MongoClient = require('mongodb').MongoClient;
var utils = require('./utils');
var environment = require('./environment');

let _db = null;
let linksCollection = null;
let statsCollection = null;

module.exports = {
  connect: () => {
    MongoClient.connect(environment.mongoUrl, (err, db) => {
      if (err) {
        console.error('Failed to connect to DB:', err);
      } else {
        _db = db;
        linksCollection = db.collection('linksCollection');
        statsCollection = db.collection('statsCollection');
      }
    });
  },

  insertLinks: (links) => {
    console.log("Inserting lins:", links);
    Promise.all(links.map(link => linksCollection.update(
      { linkId: link.linkId },
      link,
      { upsert: true }
    ))).then(results => console.log("REsults:", results););
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
  }
}
