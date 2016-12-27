var express = require('express');
var app = express();
var request = require('request');
var path = require('path');
var parseFrontPage = require('./parseFrontPage');

var redditLinks = [];
var linkMap = {};

console.log('Fetching')
parseFrontPage(function (err, window) {
  console.log('Parsing');
  var allLinks = [];
  var $ = window.$;
  var links = $('.title.may-blank');
  links.each(function () {
    var element = $(this);
    allLinks.push({
      text: element.text(),
      href: element.attr('href'),
    })
  });
  console.log('Mapping');
  allLinks = allLinks.map(function (link) {
    if (link.href.indexOf('imgur') > -1 &&
      !(link.href.endsWith('.jpg') ||
      link.href.endsWith('.png') ||
      link.href.endsWith('.gif')) ) {
        link.href = link.href + '.jpg';
    }
    return link;
  });
  console.log('Filtering');
  allLinks = allLinks.filter(function (link) {
    if (link.text.indexOf('/r/') > -1) {
      return false;
    }
    return true;
  })
  allLinks.forEach(function (link) {
    request(link.href, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        link.id = Math.floor(Math.random() * 10000000);
        linkMap[link.id] = link;
        redditLinks.push(link);
        console.log('pushed a link:', link.id);
      }
    });
  });
});

app.use(express.static('../client'));

app.get('/frontpage', function (req, res) {
  console.log('Full page');
  res.send(redditLinks);
});

app.get('/:id', function (req, res) {
  console.log('Sharing page');
  res.sendFile(path.resolve(__dirname + '/../client/index.html'));
});

app.get('/picture/:id', function (req, res) {
  console.log('Sharing picture');
  var defaultLink = {
    text: 'Uh oh! We couldn\'t find the picture you were looking for. We\'ll try to fix it on our end :)',
    href: 'http://imgur.com/PbcZq8t.jpg',
    id: 47378
  };

  res.send([linkMap[req.params.id] || defaultLink]);
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
