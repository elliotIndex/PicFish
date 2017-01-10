const fs = require('fs');
const database = require('./database');
const globals = require('./globals');
const renderTemplate = require('./rendering/renderTemplate');

module.exports = (terminal) => {
  const filename = terminal +'.html';
  return new Promise((resolve, reject) => {
    fs.access(globals.renderedSharedLinksDir + filename, (err) => {
      if (err) {
        console.log('Creating file', filename);
        database.findLink(terminal)
        .then(link => renderTemplate(
          [link],
          filename,
          globals.renderedSharedLinksDir,
          link.text
        ))
        .catch(err => {
          console.log('Could not find link:', terminal);
          return globals.defaultFilename;
        })
        .then(filename => resolve(filename));
      } else {
        console.log('Found cached file');
        resolve(filename);
      }
    });
  });
}
