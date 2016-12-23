var express = require('express')
var app = express()
var request = require('request');
var fetchFrontPage = require('./fetchFrontPage');

var redditResponse = {};

fetchFrontPage(function (error, response, body) {
  console.log("Recieved response from reddit!");
  redditResponse.error = error;
  redditResponse.response = response;
  redditResponse.body = body;
});

app.get('/frontpage', function(req, res) {
  console.log("type", typeof(redditResponse.body));
  res.send(redditResponse.body);
});

app.listen(3000, function() {
  console.log('Example app listening on port 3000!')
});

app.use(express.static('client'));
