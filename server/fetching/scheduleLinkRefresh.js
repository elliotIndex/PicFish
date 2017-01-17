const cron = require('node-cron');
const fetchCategoryLinks = require('./fetchCategoryLinks');
const globals = require('../globals');
const database = require('../database/database');
const clearFacebookCache = require('../maintenance/clearFacebookCache');
const utils = require('../misc/utils');
const renderTemplate = require('../rendering/renderTemplate');
const renderCategory = require('../rendering/renderCategory');

function fetchAllCategories(categories) {
  for (let category in categories) {
    fetchCategoryLinks(categories[category])
    .then(links => database.insertLinks(links, category))
    .catch(error => console.error('Error storing category:', category, error))
    .then(() => renderCategory(category))
    .catch(error => console.error('Error rendering category', category, error));
  }
}

function scheduleLinkRefresh(categories) {
  console.log('Fetching all categories');
  fetchAllCategories(categories);

  console.log('Scheduling Link Refresh');
  cron.schedule(globals.linkRefreshInterval, () => {
    console.log('Refreshing links');
    fetchAllCategories(categories);
  });
}

module.exports = scheduleLinkRefresh;
