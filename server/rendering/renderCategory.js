var renderTemplate = require('./renderTemplate');
var globals = require('../globals');
var utils = require('../misc/utils');
var database = require('../database/database');

module.exports = (category) => database.getFirstBatch(category)
  .then(links => renderTemplate(
    links,
    category + '.html',
    globals.renderedCategoriesDir,
    utils.toTitleCase(category)
  )
);
