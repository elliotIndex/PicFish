var renderTemplate = require('./renderTemplate');
var globals = require('../globals');
var utils = require('../misc/utils');
var database = require('../database/database');

module.exports = (category) => database.getFirstBatch(category)
  .catch(error => {
    console.error(error);
    return [];
  })
  .then(links => renderTemplate(
    links,
    (category || 'all') + '.html',
    globals.renderedCategoriesDir,
    utils.toTitleCase(category || 'all')
  )
  .catch(error => {
    console.error(error);
    return [];
  })
);
