const express = require('express');
const app = express();
const path = require('path');
const scheduleLinkRefresh = require('./scheduleLinkRefresh');
const globals = require('./globals');
const cleanup = require('./cleanup');
const database = require('./database');

const globalStorageContext = { linkMap: {} };

app.use(express.static('../client'));

app.get('/:anything', function (req, res) {
  res.sendFile(path.resolve(__dirname + '/../client/index.html'));
});

app.get('/sub/:subname', function (req, res) {
  const sub = globalStorageContext[req.params.subname];
  res.send(sub || [globals.defaultLink]);
});

app.get('/picture/:linkId', function (req, res) {
  database.findLink(req.params.linkId)
  .then(link => {
    console.log("Found link:", link);
    res.send([link]);
  })
  .catch(error => {
    console.log("Could not find link:", req.params.linkId);
    res.send([globals.defaultLink]);
  })
});


app.listen(3000, function () {
  console.log('Express server connected');
});


database.connect();
cleanup.prepForCleanup();

scheduleLinkRefresh(globals.subreddits, globalStorageContext);
