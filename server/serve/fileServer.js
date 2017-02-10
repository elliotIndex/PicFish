const path = require('path');
const globals = require('../globals');
const findOrCreateFile = require('./findOrCreateFile');

module.exports = {
  serveErrorFile: (res, terminal) => {
    res.sendFile(path.resolve(globals.errorFilename));
  },

  serveDefaultCategory: (res) => {
    res.sendFile(path.resolve(globals.renderedCategoriesDir + 'all.html'));
  },

  serveCategory: (res, category) => {
    res.sendFile(path.resolve(globals.renderedCategoriesDir + category + '.html'));
  },

  serveLinkFile: (res, linkId) => {
    findOrCreateFile(linkId) // resolves with filepath, rejects if id not found
    .then(filename => res.sendFile(globals.renderedSharedLinksDir + filename))
    .catch(err => res.sendFile(globals.errorFilename));
  },

  sendStyleSheet: (res) => {
    res.sendFile(path.resolve(globals.stylesheetDir));
  },

  serveFavicon: (res) => {
    res.sendFile(path.resolve(globals.faviconDir));
  }
}
