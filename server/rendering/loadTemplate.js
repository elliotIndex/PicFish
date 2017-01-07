const jsdom = require("jsdom");

function loadTemplate() {
  return new Promise(function(resolve, reject) {
    jsdom.env(
      "./template.html",
      ["http://code.jquery.com/jquery.js"],
      (err, page) => err ? reject(err) : resolve(page)
    );
  );
}
function renderLinks(links) {
  loadTemplate()
  .then(page => {
    const $ = page.$;
    buildRedditList(links, $)
  })
}
loadTemplate()
.then(page => {
  console.log("got page:", page);
})
.catch(err => {
  console.log("did NOT get page:", err);
})

function buildRedditList(links, $) {
  var imageList = $('#image-list');
  console.log("links", links)
  links.forEach(function (link) {
    imageList.append(buildListItem(link, $));
  });
}

function buildListItem(link, $) {
  var listItem = $('<li>', { class: 'list-entry' });
    var anchor = $('<h3>', { text: link.text, class: 'link-title' });
      var share = $('<h5>', { text: buildShareLink(link), class: 'link-share' });
        var image = $('<img>', { src: link.href, class: 'link-img' });
          listItem.append(anchor);
          listItem.append(share);
          listItem.append(image);
          return listItem;
        }

        function buildShareLink(link) {
          var host = window.location.host;
          return [host, link.linkId].join('/');
        }

        var mu = require('mu2'); // notice the "2" which matches the npm repo, sorry..

        mu.root = __dirname + '/templates'
        mu.compileAndRender('index.html', {name: "john"})
        .on('data', function (data) {
          console.log(data.toString());
        });
