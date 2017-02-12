const cron = require('node-cron');
const fs = require('fs');
const globals = require('../globals');
const utils = require('../misc/utils');
const removeDeadLink = require('../scanners/removeDeadLink');
const database = require('../database/database');
const renderFromDb = require('../rendering/renderFromDb');
const validate = require('../validation/validate');

function noOp() {};
module.exports = {
  prepForServerShutdown: (callback) => {

    // attach user callback to the process event emitter
    // if no callback, it will still exit gracefully on Ctrl-C
    callback = callback || noOp;
    process.on('cleanup', callback);

    // do app specific cleaning before exiting
    process.on('exit', function () {
      process.emit('cleanup');
    });

    // catch ctrl+c event and exit normally
    process.on('SIGINT', function () {
      process.exit(2);
    });

    //catch uncaught exceptions, trace, then exit normally
    process.on('uncaughtException', function(e) {
      process.exit(99);
    });
  },

  scheduleFileCleanup: () => {
    cron.schedule(globals.fileCleanupInterval, () => {
      fs.readdir(globals.renderedSharedLinksDir, (err, files) => {
        files.forEach(file => {
          if (file !== '.gitkeep' && file !== 'defaultLink.html') {
            fs.unlink(globals.renderedSharedLinksDir + file);
          }
        });
      })
    });
  },

  scheduleLinkCleanup: () => {
    cron.schedule(globals.linkCleanupInterval, () => {
      database.runScanner(removeDeadLink)
    });
  },

  scheduleInvalidLinkCleanup: () => {
    cron.schedule(globals.invalidLinkCleanupInterval, () => {
      database.clearInvalidLinks();
    });
  },

  validateOrDelete: (linkHref, done) => {
    database.findLink({ href: linkHref })
    .then(found => {
      if (found) {
        return validate(found)
        .catch(database.removeLink)
        .then(stats => {
          if (stats && stats.results && stats.result.n > 0) {
            renderFromDb();
          }
        })
      }
      return null;
    })
    .then(done)
    .catch(error => {
      utils.standardError(error);
      done();
    });
  }
}
