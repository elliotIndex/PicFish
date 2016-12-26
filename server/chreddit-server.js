var express = require('express');
var app = express();
var request = require('request');
var parseFrontPage = require('./parseFrontPage');

var redditLinks = [];

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
      href: element.attr('href')
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
  allLinks.forEach(function (link) {
    request(link.href, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        redditLinks.push(link);
        console.log('pushed a link:', link.href);
      }
    });
  });
});


app.get('/frontpage', function (req, res) {
  console.log('serving request');
  res.send(redditLinks);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});

app.use(express.static('../client'));
