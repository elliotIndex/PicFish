const path = require('path');
const globals = require('../globals');
const findOrCreateFile = require('./findOrCreateFile');

module.exports = {
  serveErrorFile: (res) => {
    console.log('Serving Error file');
    res.sendFile(path.resolve(globals.errorFilename));
  },

  serveDefaultCategory: (res) => {
    console.log('Serving default category');
    res.sendFile(path.resolve(globals.renderedCategoriesDir + 'all.html'));
  },

  serveCategory: (res, category) => {
    console.log('Serving /', category);
    res.sendFile(path.resolve(globals.renderedCategoriesDir + category + '.html'));
  },

  serveLinkFile: (res, linkId) => {
    console.log('Serving shared link /', linkId);
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
