const cron = require('node-cron');
const fetchCategoryLinks = require('./fetchCategoryLinks');
const globals = require('../globals');
const database = require('../database/database');
const clearFacebookCache = require('../maintenance/clearFacebookCache');
const utils = require('../misc/utils');
const renderTemplate = require('../rendering/renderTemplate');

function fetchAllCategories(categories) {
  for (let picFishSub in categories) {
    const categoryLinks = fetchCategoryLinks(categories[picFishSub]);

    categoryLinks
    .then(links => renderTemplate(
      links,
      picFishSub + '.html',
      globals.renderedCategoriesDir,
      utils.toTitleCase(picFishSub)
    ))
    .catch(error => console.error('Error rendering category:', category, error))
    .then(() => clearFacebookCache(picFishSub));

    categoryLinks
    .then(links => database.insertLinks(links))
    .catch(error => console.error('Error storing category:', category, error));
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
