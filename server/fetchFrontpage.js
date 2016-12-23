var request = require('request');

function fetchFrontPage(callback) {
  request.get('http://www.reddit.com', callback);
}

module.exports = fetchFrontPage;
