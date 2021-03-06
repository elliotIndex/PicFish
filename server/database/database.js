var MongoClient = require('mongodb').MongoClient;
var async = require('async');
var utils = require('../misc/utils');
var environment = require('../config/environment');
var globals = require('../globals');

let _db = null;
let linksCollection = null;
let invalidLinksCollection = null;
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
          linksCollection = db.collection('Link');
          statsCollection = db.collection('Stat');
          invalidLinksCollection = db.collection('InvalidLink');
          linksCollection.createIndex({ categoryIndex: 1 });
          linksCollection.createIndex({ totalIndex: 1 });
          statsCollection.createIndex({ date: 1 });

          resolve();
        }
      });
    })
  },

  insertLinks: (links, category) => {
    let numInsertions = 0;
    return new Promise((resolve, reject) => {
      async.eachSeries(links, (currentLink, done) => {
        linksCollection.findOne({ linkId: currentLink.linkId })
        .then(foundLink => {
          if (!foundLink) {
            currentLink.category = category;
            if (!maxCategoryIndecies[category]) {
              maxCategoryIndecies[category] = 0;
            }
            currentLink.categoryIndex = ++maxCategoryIndecies[category];
            currentLink.totalIndex = ++maxTotalIndex;
            return linksCollection.insert(currentLink)
            .then(() => {
              numInsertions++;
              done()
            })
            .catch(err => {
              console.error(err);
              done(err);
            })
          } else {
            done();
          }
        })
        .catch(err => {
          console.error(err);
          done(err);
        });
      }, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(numInsertions)
        }
      });
    });
  },

  insertInvalidLinkId: (linkId) => {
    return invalidLinksCollection.insert({ linkId }).then(() => linkId);
  },

  isInvalidLinkId: (linkId) => {
    return invalidLinksCollection.findOne({ linkId }).then(found => !!found);
  },

  findLink: (query) => {
    return linksCollection.findOne(query)
    .then(link => {
      if (!link) {
        return null;
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

  runScanner: (scanner) => {
    linksCollection.find().sort({ totalIndex: -1 }).limit(1000).toArray()
    .then(recentItems => {
      async.eachSeries(recentItems, scanner)
    })
    .catch(error => {
      console.log("Error running scanner:", error);
    });
  },

  removeLink: (link) => {
    return linksCollection.remove({ href: link.href }, { justOne: true });
  },

  clearInvalidLinks: () => {
    return invalidLinksCollection.remove({});
  }
}

module.exports = database;
