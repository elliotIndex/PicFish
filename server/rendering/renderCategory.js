var renderTemplate = require('./renderTemplate');
var globals = require('../globals');
var utils = require('../misc/utils');
var database = require('../database/database');
var keywords = require('../keywords/keywords');

module.exports = (category) => database.getFirstBatch(category)
  .catch(error => {
    console.error(error);
    return [];
  })
  .then(links => renderTemplate(
    links,
    category,
    (category || 'all') + '.html',
    globals.renderedCategoriesDir,
    utils.toTitleCase(category || 'all'),
    keywords(category)
  )
  .catch(error => {
    console.error(error);
    return [];
  })
);
