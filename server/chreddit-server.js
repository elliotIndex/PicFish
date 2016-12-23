var express = require('express')
var app = express()
var request = require('request');

app.get('/frontpage', function(req, res) {
  request.get('http://www.reddit.com', function (error, response, body) {
    console.log("error", error);
    console.log("response", response);
    console.log("body", body);
    res.send(response);
  });
})

app.listen(3000, function() {
  console.log('Example app listening on port 3000!')
})

app.use(express.static('client'))
