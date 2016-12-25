var jsdom = require("jsdom");

function parseFrontPage(callback) {
  jsdom.env({
    url: "https://www.reddit.com/r/aww/",
    scripts: ["http://code.jquery.com/jquery.js"],
    done: callback
  });
}

module.exports = parseFrontPage;
