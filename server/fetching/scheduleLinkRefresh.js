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
    (category) => fetchCategoryLinks(category)
      .then(links => database.insertLinks(links, category))
      .catch(error => console.error('Error storing category:', category, error))
      .then(() => renderCategory(category))
      .catch(error => console.error('Error rendering category', category, error))
      .then(() => renderCategory())
      .always(done)
  });
}

function scheduleLinkRefresh(categories) {
  fetchAllCategories(categories);

  cron.schedule(globals.linkRefreshInterval, () => {
    fetchAllCategories(categories);
  });
}

module.exports = scheduleLinkRefresh;
