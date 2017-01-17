var MongoClient = require('mongodb').MongoClient;
var utils = require('../misc/utils');
var environment = require('../config/environment');
var globals = require('../globals');

let _db = null;
let linksCollection = null;
let statsCollection = null;
let maxTotalIndex = 0;
let maxCategoryIndecies = {};

var database = {
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
          linksCollection.createIndex({ categoryIndex: 1 });
          linksCollection.createIndex({ totalIndex: 1 });
          statsCollection.createIndex({ date: 1 });

          resolve();
        }
      });
    })
  },

  insertLinks: (links, category) => {
    console.log("Insergin links");
    links.map(link => {


      linksCollection.findOne({ linkId: link.linkId })
      .then(foundLink => {
        if (!foundLink) {
          link.category = category;
          link.categoryIndex = maxCategoryIndecies[category]++;
          link.totalIndex = maxTotalIndex++;
          return linksCollection.insert(link);
        }
        return foundLink;
      })
      .catch(err => console.log("Error updating link:", link))
    });
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

  getBatch: (index, category) => {
    if (category) {
      return linksCollection.find({
        $and: [
          { category },
          { categoryIndex: { $lte: index } }
        ]
      })
      .limit(6)
      .toArray();
    } else {
      return linksCollection.find({
        totalIndex: { $lte: index }
      })
      .limit(6)
      .toArray();
    }
  },

  getFirstBatch: (category) => {
    console.log("geting first batch for category", category);
    if (category) {
      return database.getBatch(maxCategoryIndecies[category], category);
    } else {
      return database.getBatch(maxTotalIndex);
    }
  },

  initMaxIndecies: () => {
    const maxIndecies = [];
    for (let category in globals.categories) {
      if (!maxCategoryIndecies[category]) {
        maxIndecies.push(
          new Promise((resolve, reject) => {
            linksCollection
            .find({ category })
            .sort({ categoryIndex: -1 })
            .limit(1)
            .each(link => {
              maxCategoryIndecies[category] = link ? link.categoryIndex : 0;
              resolve(category);
            })
          })
        )
      }
    }
    maxIndecies.push(
      new Promise((resolve, reject) => {
        linksCollection
        .find()
        .sort({ categoryIndex: -1 })
        .limit(1)
        .each(link => {
          maxTotalIndex = link ? link.totalIndex : 0;
          resolve('total');
        })
      })

    );
    return Promise.all(maxIndecies);
  }
}

module.exports = database;
