const cron = require('node-cron');
const async = require('async');
const fetchCategoryLinks = require('./fetchCategoryLinks');
const globals = require('../globals');
const database = require('../database/database');
const clearFacebookCache = require('../maintenance/clearFacebookCache');
const utils = require('../misc/utils');
const renderTemplate = require('../rendering/renderTemplate');
const renderCategory = require('../rendering/renderCategory');

function fetchAllCategories(categories) {
  async.eachSeries(Object.keys(categories), (category, done) => {
    fetchCategoryLinks(category)
    .then(links => {
      console.log("Got", links.length, "category links")
    })
    .then(links => database.insertLinks(links, category))
    .then(something => {
      console.log("Inserted", something, "into db");
    })
    .catch(error => console.error('Error storing category:', category, error))
    .then(() => renderCategory(category))
    .catch(error => console.error('Error rendering category', category, error))
    .then(() => renderCategory())
    .then(() => {
      console.log("got to done...");
      done();
    })
    .catch(error => {
      utils.standardError(error);
      done(error);
    });
  });
}

function scheduleLinkRefresh(categories) {
  fetchAllCategories(categories);

  cron.schedule(globals.linkRefreshInterval, () => {
    fetchAllCategories(categories);
  });
}

module.exports = scheduleLinkRefresh;
