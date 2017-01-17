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
  .then(renderFromDb);

  // Render initial pages

  if (!environment.noFetch) {
    scheduleLinkRefresh(globals.categories);
  }

  renderDevPage();

  cleanup.prepForServerShutdown(database.close);
  cleanup.scheduleFileCleanup();
}

function renderFromDb() {
  for (let category in globals.categories) {
    renderCategory(category)
    .catch(() => console.log("Error rendering initial category", category));
  }
}
