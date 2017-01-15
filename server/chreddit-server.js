const express = require('express');
const app = express();
const scheduleLinkRefresh = require('./fetching/scheduleLinkRefresh');
const globals = require('./globals');
const cleanup = require('./maintenance/cleanup');
const database = require('./database/database');
const environment = require('./config/environment');
const fileServer = require('./serve/fileServer');
const renderDevPage = require('./rendering/renderDevPage');
const utils = require('./misc/utils');

app.get('/', function (req, res) {
  database.incrementVisitCount();
  fileServer.serveDefaultSubreddit(req, res);
});

app.use(express.static(globals.staticFileDir));

app.get('/:terminal', function (req, res) {
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
