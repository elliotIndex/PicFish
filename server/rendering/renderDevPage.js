const renderTemplate = require('./renderTemplate');
const globals = require('../globals');

module.exports = function renderDevPage() {
  renderTemplate(
    [
      globals.defaultLink, globals.defaultLink, globals.defaultLink,
      globals.defaultLink, globals.defaultLink, globals.defaultLink
    ],
    'all',
    'dev.html',
    globals.renderedCategoriesDir,
    'Dev'
  )
}
