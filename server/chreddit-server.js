var express = require('express')
var app = express()
var http = require('http');

app.get('/frontpage', function (req, res) {
  var options = {
    host: 'www.random.org',
    path: '/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
  };
  http.request(options, handleRedditResponse).end();

  res.send('Hello World!')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

app.use(express.static('client'))

//The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'


var handleRedditResponse = function(response) {
  var str = '';

  //another chunk of data has been recieved, so append it to `str`
  response.on('data', function (chunk) {
    str += chunk;
  });

  //the whole response has been recieved, so we just print it out here
  response.on('end', function () {
    console.log("ending response:", str);
  });
}
