const express = require('express');
const app = express();
const globals = require('./globals');
const database = require('./database/database');
const environment = require('./config/environment');
const fileServer = require('./serve/fileServer');
const utils = require('./misc/utils');
const init = require('./maintenance/init');

app.get('/', function (req, res) {
  database.incrementVisitCount();
  fileServer.serveDefaultCategory(req, res);
});

app.use(express.static(globals.staticFileDir));

app.get('/:terminal', function (req, res) {
  database.incrementVisitCount();
  if (!req.params.terminal) {
    fileServer.serveDefaultCategory(req, res);
  } else if (utils.isCategory(req.params.terminal)) {
    fileServer.serveCategory(req, res, req.params.terminal);
  } else if (utils.isLinkId(req.params.terminal)) {
    fileServer.serveLinkFile(req, res, req.params.terminal);
  } else {
    fileServer.serveDefaultFile(req, res);
  }
});

app.listen(environment.port, function () {
  console.log('Express server connected on port', environment.port);
});

init();
