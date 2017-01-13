const express = require('express');
const app = express();
const scheduleLinkRefresh = require('./scheduleLinkRefresh');
const globals = require('./globals');
const cleanup = require('./cleanup');
const database = require('./database');
const environment = require('./environment');
const fileServer = require('./fileServer');
const renderDevPage = require('./renderDevPage');
const utils = require('./utils');

app.get('/', function (req, res) {
  console.log("slash?", req.params);
  database.incrementVisitCount();
  fileServer.serveDefaultSubreddit(req, res);
});

app.use(express.static(globals.staticFileDir));

app.get('/:terminal', function (req, res) {
  console.log("req.params.terminal", req.params.terminal);
  database.incrementVisitCount();
  if (!req.params.terminal) {
    fileServer.serveDefaultSubreddit(req, res);
  } else if (utils.isSubreddit(req.params.terminal)) {
    fileServer.serveSubreddit(req, res, req.params.terminal);
  } else if (utils.isLinkId(req.params.terminal)) {
    fileServer.serveLinkFile(req, res, req.params.terminal);
  } else {
    fileServer.serveDefaultFile(req, res);
  }
});

app.listen(environment.port, function () {
  console.log('Express server connected on port', environment.port);
});

database.connect();

cleanup.prepForServerShutdown(database.close);
cleanup.scheduleFileCleanup();

if (!environment.noFetch) {
  scheduleLinkRefresh(globals.subreddits);
}

renderDevPage();
