var express = require('express')
var app = express()
var http = require('http');
// var request = require('request');

app.get('/frontpage', function(req, res) {
  var options = {
    host: 'www.reddit.com',
    // path: ''
  };
  http.request(options, handleRedditResponse(res)).end();
})

app.listen(3000, function() {
  console.log('Example app listening on port 3000!')
})

app.use(express.static('client'))

//The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'

var handleRedditResponse = function handleRedditResponse(res) {

  return function(response) {
    var str = '';

    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function(chunk) {
      str += chunk;
      console.log("got chunk:", chunk);
    });

    //the whole response has been recieved, so we just print it out here
    response.on('end', function() {
      console.log("ending response:", str);
      res.send("Response:" + str)
    });

  }
}


// request.get('http://www.whatever.com/my.csv', function (error, response, body) {
//     if (!error && response.statusCode == 200) {
//         var csv = body;
//         // Continue with your processing here.
//     }
// });
