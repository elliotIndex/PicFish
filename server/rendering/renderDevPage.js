const renderTemplate = require('./renderTemplate');
const globals = require('../globals');

module.exports = function renderDevPage() {
  renderTemplate(
    [globals.defaultLink, globals.defaultLink, globals.defaultLink],
    'dev.html',
    globals.renderedCategoriesDir,
    'Dev'
  )
  .then(() => console.log('Rendered dev page'))
}
