const express = require('express');
const app = express();
const path = require('path');
const scheduleLinkRefresh = require('./scheduleLinkRefresh');
const globals = require('./globals');
const cleanup = require('./cleanup');
const database = require('./database');
const environment = require('./environment');
const utils = require('./utils');

const globalStorageContext = { linkMap: {} };

app.use(express.static('../client'));

app.get('/:terminal', function (req, res) {
  if (utils.isSubreddit(req.params.terminal)) {
    res.sendFile(path.resolve(__dirname + '/rendered/' + req.params.terminal + '.html'));
  } else {
    res.sendFile(path.resolve(__dirname + '/../client/index.html'));
  }
});

app.get('/sub/:subname', function (req, res) {
  const sub = globalStorageContext[req.params.subname];
  res.send(sub || [globals.defaultLink]);
});

app.get('/picture/:linkId', function (req, res) {
  database.findLink(req.params.linkId)
  .then(link => res.send([link]))
  .catch(error => res.send([globals.defaultLink]));
});


app.listen(environment.port, function () {
  console.log('Express server connected');
});


database.connect();
cleanup.prepForCleanup(database.close);

scheduleLinkRefresh(globals.subreddits, globalStorageContext);
