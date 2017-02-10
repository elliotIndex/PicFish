const cron = require('node-cron');
const fs = require('fs');
const globals = require('../globals');
const environment = require('../config/environment');
const utils = require('../misc/utils');
const database = require('../database/database');
const cleanup = require('./cleanup');
const renderDevPage = require('../rendering/renderDevPage');
const renderCategory = require('../rendering/renderCategory');
const renderFromDb = require('../rendering/renderFromDb');
const scheduleLinkRefresh = require('../fetching/scheduleLinkRefresh');

module.exports = () => {
  console.log('Starting server', Date());
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
