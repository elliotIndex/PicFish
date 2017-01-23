const express = require('express');
const app = express();
const globals = require('./globals');
const database = require('./database/database');
const environment = require('./config/environment');
const fileServer = require('./serve/fileServer');
const dataserver = require('./serve/dataserver');
const utils = require('./misc/utils');
const init = require('./maintenance/init');

app.get('/', function (req, res) {
  database.incrementVisitCount();
  if (req.query && req.query.index) {
    dataserver.serveRequest(res, req.query.index);
  } else {
    fileServer.serveDefaultCategory(res);
  }
});

app.use(express.static(globals.staticFileDir));

app.get('/:terminal', function (req, res) {
  if (req.query && req.query.index) {
    dataserver.serveRequest(res, req.query.index, req.params.terminal);
  } else {
    database.incrementVisitCount();
    if (!req.params.terminal) {
      fileServer.serveDefaultCategory(res);
    } else if (utils.isCategory(req.params.terminal)) {
      fileServer.serveCategory(res, req.params.terminal);
    } else if (utils.isLinkId(req.params.terminal)) {
      fileServer.serveLinkFile(res, req.params.terminal);
    } else {
      fileServer.serveErrorFile(res);
    }
  }

});

app.listen(environment.port, function () {
  console.log('Express server connected on port', environment.port);
});

init();
