const path = require('path');
const globals = require('../globals');
const findOrCreateFile = require('./findOrCreateFile');

module.exports = {
  serveDefaultFile: (req, res) => {
    console.log('Serving default file');
    res.sendFile(path.resolve(globals.defaultFilename));
  },

  serveDefaultCategory: (req, res) => {
    console.log('Serving default category');
    res.sendFile(path.resolve(globals.renderedCategoriesDir + globals.categories['general'] + '.html'));
  },

  serveCategory: (req, res, category) => {
    console.log('Serving /', category);
    res.sendFile(path.resolve(globals.renderedCategoriesDir + category + '.html'));
  },

  serveLinkFile: (req, res, linkId) => {
    console.log('Serving shared link /', linkId);
    findOrCreateFile(linkId) // resolves with filepath, rejects if id not found
    .then(filename => res.sendFile(globals.renderedSharedLinksDir + filename))
    .catch(err => res.sendFile(globals.defaultFilename));
  },

  sendStyleSheet: (req, res) => {
    res.sendFile(path.resolve(globals.stylesheetDir));
  }
}
