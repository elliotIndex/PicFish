var MongoClient = require('mongodb').MongoClient;

// Connection URL
// change for prod?
var url = 'mongodb://localhost:27017/links';
let linksCollection = null;

module.exports = {
  connect: () => {
    MongoClient.connect(url, (err, db) => {
      if (err) {
        console.error("Failed to connect to DB:", err);
      } else {
        linksCollection = db.collection('links');
      }
    });
  },

  insertLinks: (links) => {
    // links.forEach(link => {
    //
    // })
    linksCollection.insert(links);
  },

  findLink: (linkId) => {
    linksCollection.findOne({ linkId })
  },
}
