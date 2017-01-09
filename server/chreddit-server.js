const express = require('express');
const app = express();
const scheduleLinkRefresh = require('./scheduleLinkRefresh');
const globals = require('./globals');
const cleanup = require('./cleanup');
const database = require('./database');
const environment = require('./environment');
const fileServer = require('./fileServer');
const utils = require('./utils');

// app.get('/style.css', function (req, res) {
//   fileServer.sendStyleSheet(req, res);
// });


app.use(express.static(globals.staticFileDir));

app.get('/', function (req, res) {
  database.incrementVisitCount();
  fileServer.serveDefaultFile(req, res);
});

app.get('/:terminal', function (req, res) {
  database.incrementVisitCount();
  if (!req.params.terminal) {
    fileServer.serveDefaultFile(req, res);
  } else if (utils.isSubreddit(req.params.terminal)) {
    fileServer.serveSubreddit(req, res, req.params.terminal);
  } else if (utils.isLinkId(req.params.terminal)) {
    fileServer.serveLinkFile(req, res, linkId);
  } else {
    fileServer.serveDefaultFile(req, res);
  }
});

app.listen(environment.port, function () {
  console.log('Express server connected');
});

database.connect();

cleanup.prepForServerShutdown(database.close);
cleanup.scheduleFileCleanup();

scheduleLinkRefresh(globals.subreddits);
