const globals = require('../globals');
const utils = require('../misc/utils');
const renderCategory = require('./renderCategory');

function renderFromDb() {
  for (let category in globals.categories) {
    renderCategory(category)
    .catch(utils.standardError);
  }
  renderCategory()
  .catch(utils.standardError);
}

module.exports = renderFromDb;
