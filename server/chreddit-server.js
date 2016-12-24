var express = require('express')
var app = express()

var fetchFrontPage = require('./fetchFrontPage');
var parseFrontPage = require('./parseFrontPage');

var redditResponse = {};
var redditPage = null;

fetchFrontPage(function (error, response, body) {
  console.log("Recieved response from reddit!");
  redditResponse.error = error;
  redditResponse.response = response;
  redditResponse.body = body;
  redditPage = parseFrontPage(body)
});

app.get('/frontpage', function(req, res) {
  console.log("type", typeof(redditResponse.body));
  res.send(redditPage);
});

app.listen(3000, function() {
  console.log('Example app listening on port 3000!')
});

app.use(express.static('client'));
