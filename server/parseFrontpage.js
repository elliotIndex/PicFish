const request = require('request');
const jsdom = require("jsdom");
const utils = require('./utils');

function parseFrontPage(context) {
  jsdom.env({
    url: "https://www.reddit.com/r/aww/",
    scripts: ["http://code.jquery.com/jquery.js"],
    done: function (err, window) {
      console.log('Parsing');
      let allLinks = [];
      const $ = window.$;
      const links = $('.title.may-blank');
      links.each(function () {
        const element = $(this);
        allLinks.push({
          text: element.text(),
          href: element.attr('href'),
        })
      });
      console.log('Mapping');
      allLinks = allLinks.reduce(function (allLinks, link) {
        if (link.href.indexOf('imgur') > -1 &&
          !(link.href.endsWith('.jpg') ||
          link.href.endsWith('.png') ||
          link.href.endsWith('.gif')) ) {
            const jpg = Object.assign({}, link);
            const gif = Object.assign({}, link);

            jpg.href = jpg.href + '.jpg';
            gif.href = gif.href + '.gif';
            allLinks.push(jpg);
            allLinks.push(gif);
        } else {
          allLinks.push(link);
        }

        return allLinks;
      }, []);
      console.log('Filtering');
      allLinks = allLinks.filter(function (link) {
        if (
          link.text.indexOf('/r/') > -1 ||
          link.text.indexOf('reddit') > -1 ||
          link.text.indexOf('Reddit') > -1
        ) {
          return false;
        }
        return true;
      })
      allLinks.forEach(function (link) {
        request(link.href, function (error, response, body) {
          if (!error && response.statusCode === 200) {
            if (utils.isImageResponse(response) && !utils.hasLink(context.redditLinks, link)){
              link.id = Math.floor(Math.random() * 10000000);
              context.linkMap[link.id] = link;
              context.redditLinks.push(link);
              console.log('pushed a link:', link.id);
            }
          }
        });
      });
    }

  });
}


module.exports = parseFrontPage;
