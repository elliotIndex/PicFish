var express = require('express')
var app = express()

var parseFrontPage = require('./parseFrontPage');

var redditLinks = [];

parseFrontPage(function (err, window) {
  var $ = window.$;
  var links = $(".title.may-blank");
  links.each(function() {
    var element = $(this);
    redditLinks.push({
      text: element.text(),
      href: element.attr('href')
    })
  });
  console.log("Finished parsing");
});

app.get('/frontpage', function(req, res) {
  res.send(redditLinks);
});

app.listen(3000, function() {
  console.log('Example app listening on port 3000!')
});

app.use(express.static('client'));
