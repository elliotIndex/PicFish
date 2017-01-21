const path = require('path');
const globals = require('../globals');
const findOrCreateFile = require('./findOrCreateFile');

module.exports = {
  serveDefaultFile: (res) => {
    console.log('Serving default file');
    res.sendFile(path.resolve(globals.defaultFilename));
  },

  serveDefaultCategory: (res) => {
    console.log('Serving default category');
    res.sendFile(path.resolve(globals.renderedCategoriesDir + 'general.html'));
  },

  serveCategory: (res, category) => {
    console.log('Serving /', category);
    res.sendFile(path.resolve(globals.renderedCategoriesDir + category + '.html'));
  },

  serveLinkFile: (res, linkId) => {
    console.log('Serving shared link /', linkId);
    findOrCreateFile(linkId) // resolves with filepath, rejects if id not found
    .then(filename => res.sendFile(globals.renderedSharedLinksDir + filename))
    .catch(err => res.sendFile(globals.defaultFilename));
  },

  sendStyleSheet: (res) => {
    res.sendFile(path.resolve(globals.stylesheetDir));
  }
}
