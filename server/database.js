var MongoClient = require('mongodb').MongoClient;

// Connection URL
// change for prod?
var url = 'mongodb://localhost:27017/linksDb';
let _db = null;
let linksCollection = null;

module.exports = {
  connect: () => {
    MongoClient.connect(url, (err, db) => {
      if (err) {
        console.error("Failed to connect to DB:", err);
      } else {
        _db = db;
        linksCollection = db.collection('linksCollection');
      }
    });
  },

  insertLinks: (links) => {
    links.forEach(link => linksCollection.update(
      { linkId: link.linkId },
      link,
      { upsert: true }
    ));
  },

  findLink: (linkId) => {
    return linksCollection.findOne({ linkId })
    .then(link => {
      if (!link) {
        throw new Error("Could not find link with id: ", linkId)
      } else {
        return link;
      }
    });
  },

  close: () => {
    console.log("Closing Database");
    _db && _db.close();
  }
}
