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
    // recursively return number of links inserted
    if (!links || !links.length) {
      return new Promise(resolve => resolve(0));
    }
    const currentLink = links.pop();
    return linksCollection.findOne({ linkId: currentLink.linkId })
    .then(foundLink => {
      if (!foundLink) {
        currentLink.category = category;
        if (!maxCategoryIndecies[category]) {
          maxCategoryIndecies[category] = 0;
        }
        currentLink.categoryIndex = ++maxCategoryIndecies[category];
        currentLink.totalIndex = ++maxTotalIndex;
        return linksCollection.insert(currentLink)
        .catch(err => console.error(err))
        .then(() => database.insertLinks(links, category))
        .then(insertions => insertions + 1);
      }
      return database.insertLinks(links, category);
    })
    .catch(err => console.error(err))
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
    _db && _db.close();
  },

  incrementVisitCount: (thing) => {
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
      .sort({ categoryIndex: -1 })
      .limit(6)
      .toArray();
    } else {
      return linksCollection.find({
        totalIndex: { $lte: index }
      })
      .sort({ totalIndex: -1 })
      .limit(6)
      .toArray();
    }
  },

  getFirstBatch: (category) => {
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
            .each((error, link) => {
              if (error) {
                reject(error);
              }
              if (link) {
                maxCategoryIndecies[category] = Math.max(
                  maxCategoryIndecies[category] || 0, link.categoryIndex || 0
                );
                resolve(maxCategoryIndecies);
              }
            })
          })
        )
      }
    }
    maxIndecies.push(
      new Promise((resolve, reject) => {
        linksCollection
        .find()
        .sort({ totalIndex: -1 })
        .limit(1)
        .each((error, link) => {
          if (error) {
            reject(error);
          }
          if (link) {
            maxTotalIndex = Math.max(maxTotalIndex || 0, link.totalIndex || 0);
            resolve(maxTotalIndex);
          }
        })
      })

    );
    return Promise.all(maxIndecies);
  },
}

module.exports = database;
