const cron = require('node-cron');
const fs = require('fs');
const globals = require('../globals');
const environment = require('../config/environment');
const utils = require('../misc/utils');
const database = require('../database/database');
const cleanup = require('./cleanup');
const renderDevPage = require('../rendering/renderDevPage');
const scheduleLinkRefresh = require('../fetching/scheduleLinkRefresh');

module.exports = () => {
  // render all the categories from DB
  //

  database.connect();

  cleanup.prepForServerShutdown(database.close);
  cleanup.scheduleFileCleanup();

  if (!environment.noFetch) {
    scheduleLinkRefresh(globals.categories);
  }

  renderDevPage();
}
