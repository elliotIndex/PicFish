var express = require('express')
var app = express()

var parseFrontPage = require('./parseFrontPage');

var redditLinks = [];

console.log('Fetching')
parseFrontPage(function (err, window) {
  console.log('Parsing');
  var $ = window.$;
  var links = $('.title.may-blank');
  links.each(function() {
    var element = $(this);
    redditLinks.push({
      text: element.text(),
      href: element.attr('href')
    })
  });
  console.log('Filtering');
  redditLinks = redditLinks.filter(function (link) {
    return link.href.indexOf('imgur') > -1;
  });
  console.log('Ready!');
});


app.get('/frontpage', function(req, res) {
  res.send(redditLinks);
});

app.listen(3000, function() {
  console.log('Example app listening on port 3000!')
});

app.use(express.static('client'));
