const express = require('express');
const app = express();
const path = require('path');
const fetchSubredditLinks = require('./fetchSubredditLinks');

const globalStorageContext = { linkMap: {} };

const defaultLink = {
  text: 'Uh oh! We couldn\'t find the picture you were looking for. We\'ll try to fix it on our end :)',
  href: 'http://imgur.com/PbcZq8t.jpg',
  id: 47378
};

console.log('Fetching')
fetchSubredditLinks('funny', globalStorageContext);
fetchSubredditLinks('aww', globalStorageContext);
fetchSubredditLinks('pics', globalStorageContext);
fetchSubredditLinks('gifs', globalStorageContext);

app.use(express.static('../client'));

app.get('/:anything', function (req, res) {
  res.sendFile(path.resolve(__dirname + '/../client/index.html'));
});

app.get('/sub/:subname', function (req, res) {
  const sub = globalStorageContext[req.params.subname];
  res.send(sub ? sub.linkList : [defaultLink]);
});

app.get('/picture/:id', function (req, res) {
  res.send([globalStorageContext.linkMap[req.params.id] || defaultLink]);
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
