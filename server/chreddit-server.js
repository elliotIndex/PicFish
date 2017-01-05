const express = require('express');
const app = express();
const path = require('path');
const parseFrontPage = require('./parseFrontPage');

const globalStorageContext = {
  redditLinks: [],
  linkMap: {},
}

console.log('Fetching')
parseFrontPage(globalStorageContext);

app.use(express.static('../client'));

app.get('/frontpage', function (req, res) {
  console.log('Full page');
  res.send(globalStorageContext.redditLinks);
});

app.get('/:id', function (req, res) {
  console.log('Sharing page');
  res.sendFile(path.resolve(__dirname + '/../client/index.html'));
});

app.get('/picture/:id', function (req, res) {
  console.log('Sharing picture');
  const defaultLink = {
    text: 'Uh oh! We couldn\'t find the picture you were looking for. We\'ll try to fix it on our end :)',
    href: 'http://imgur.com/PbcZq8t.jpg',
    id: 47378
  };

  res.send([globalStorageContext.linkMap[req.params.id] || defaultLink]);
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
