const cron = require('node-cron');
const fs = require('fs');
const globals = require('../globals');
const environment = require('../config/environment');
const utils = require('../misc/utils');
const database = require('../database/database');
const cleanup = require('./cleanup');
const renderDevPage = require('../rendering/renderDevPage');
const renderCategory = require('../rendering/renderCategory');
const scheduleLinkRefresh = require('../fetching/scheduleLinkRefresh');

module.exports = () => {
  // Init db
  database.init()
  .then(() => database.initMaxIndecies())
  .catch(utils.standardError)
  .then(renderFromDb)
  .catch(utils.standardError)
  // Render initial pages

  if (!environment.noFetch) {
    scheduleLinkRefresh(globals.categories);
  }

  renderDevPage();

  cleanup.prepForServerShutdown(database.close);
  cleanup.scheduleFileCleanup();
  cleanup.scheduleLinkCleanup();
}

function renderFromDb() {
  for (let category in globals.categories) {
    renderCategory(category)
    .catch(utils.standardError);
  }
  renderCategory()
  .catch(utils.standardError);
}
