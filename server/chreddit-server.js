const express = require('express');
const app = express();
const path = require('path');
const scheduleLinkRefresh = require('./scheduleLinkRefresh');
const globals = require('./globals');

const globalStorageContext = { linkMap: {} };

app.use(express.static('../client'));

app.get('/:anything', function (req, res) {
  res.sendFile(path.resolve(__dirname + '/../client/index.html'));
});

app.get('/sub/:subname', function (req, res) {
  const sub = globalStorageContext[req.params.subname];
  res.send(sub ? sub.linkList : [globals.defaultLink]);
});

app.get('/picture/:id', function (req, res) {
  res.send([globalStorageContext.linkMap[req.params.id] || globals.defaultLink]);
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

scheduleLinkRefresh(globals.subreddits, globalStorageContext);
