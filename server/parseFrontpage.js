var parse5 = require('parse5');
var jsdom = require("jsdom");

function parseFrontPage(page) {
  var redditPage = parse5.parse(page, {
      treeAdapter: parse5.treeAdapters.default
  });
  return redditPage;
}

function getLinks(tree) {
  var q = ["*", tree];
  var current;
  var levels = [];
  while (q.length > 1) {
    console.log(q);
    current = q.shift();
    if (current === "*") {
      levels.push([]);
      q.push(current);
    } else {
      levels[levels.length - 1] = current.nodeName;
      q = q.concat(current.childNodes);
    }
  }
}
module.exports = parseFrontPage;


jsdom.env({
  url: "https://www.reddit.com/r/aww/",
  scripts: ["http://code.jquery.com/jquery.js"],
  done: function (err, window) {
    var $ = window.$;
    console.log("HN Links");
    $(".title.may-blank").each(function() {
      console.log(" -", $(this).text());
    });
  }
});
