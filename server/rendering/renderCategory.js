var renderTemplate = require('./renderTemplate');
var globals = require('../globals');
var utils = require('../misc/utils');

module.exports = (links, category) => {
  return renderTemplate(
    links,
    category + '.html',
    globals.renderedCategoriesDir,
    utils.toTitleCase(category)
  );
}
