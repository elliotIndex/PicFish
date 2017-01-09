const express = require('express');
const app = express();
const path = require('path');
const scheduleLinkRefresh = require('./scheduleLinkRefresh');
const globals = require('./globals');
const cleanup = require('./cleanup');
const database = require('./database');
const environment = require('./environment');
const findOrCreatefile = require('./findOrCreatefile');
const utils = require('./utils');

module.exports = {
  serveDefaultFile: (req, res) => {
    console.log("Serving default subreddit");
    res.sendFile(path.resolve(globals.renderedSubredditsDir + globals.subreddits['pics'] + '.html'));
  },

  serveSubreddit: (req, res, subreddit) => {
    console.log("Serving subreddit");
    res.sendFile(path.resolve(globals.renderedSubredditsDir + subreddit + '.html'));
  },

  serveLinkFile: (req, res, linkId) => {
    console.log("Serving shared link");
    findOrCreatefile(linkId) // resolves with filepath, rejects if id not found
    .then(filename => res.sendFile(globals.renderedSharedLinksDir + filename))
    .catch(err => res.sendFile(globals.renderedSharedLinksDir + globals.defaultFilename));
  },

}
app.get('/:terminal', function (req, res) {
  database.incrementVisitCount();
  if (!req.params.terminal) {
    serveDefaultFile(req, res)
  } else if (utils.isSubreddit(req.params.terminal)) {
    serveSubreddit(req, res, req.params.terminal)
  } else if (utils.isLinkId(req.params.terminal)) {
    serveLinkFile(req, res, linkId)
  } else { // remove this one
    serveDefaultFile(req, res);
  }
});

app.listen(environment.port, function () {
  console.log('Express server connected');
});

database.connect();

cleanup.prepForServerShutdown(database.close);
cleanup.scheduleFileCleanup();

scheduleLinkRefresh(globals.subreddits);
