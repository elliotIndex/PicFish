const express = require('express');
const app = express();
const globals = require('./globals');
const database = require('./database/database');
const environment = require('./config/environment');
const cleanup = require('./maintenance/cleanup');
const fileServer = require('./serve/fileServer');
const dataserver = require('./serve/dataserver');
const validate = require('./validation/validate');
const utils = require('./misc/utils');
const init = require('./maintenance/init');

app.get('/', (req, res) => {
  database.incrementVisitCount('/');
  if (req.query && req.query.index) {
    dataserver.serveRequest(res, req.query.index);
  } else {
    fileServer.serveDefaultCategory(res);
  }
});

app.use(express.static(globals.staticFileDir));

app.get('/:terminal', (req, res) => {
  if (req.query && req.query.index) {
    dataserver.serveRequest(res, req.query.index, req.params.terminal);
  } else if (req.params.terminal === "favicon.ico") {
    fileServer.serveFavicon(res);
  } else {
    database.incrementVisitCount(req.params.terminal);
    if (!req.params.terminal) {
      fileServer.serveDefaultCategory(res);
    } else if (utils.isCategory(req.params.terminal)) {
      fileServer.serveCategory(res, req.params.terminal);
    } else if (utils.isLinkId(req.params.terminal)) {
      fileServer.serveLinkFile(res, req.params.terminal);
    } else {
      fileServer.serveErrorFile(res, req.params.terminal);
    }
  }
});

app.delete('/:uri', (req, res) => {
  res.send();
  console.log("uri", req.params.uri);
  validate(req.params.uri)
  .catch(linkId => database.removeLink({ linkId }))
})

app.listen(environment.port, () => {
  console.log('Express server connected on port', environment.port);
});

console.log("Initiating server");
init();
