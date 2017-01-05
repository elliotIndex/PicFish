const request = require('request');
const jsdom = require("jsdom");
const utils = require('./utils');

function fetchSubreddit(subreddit) {
  return new Promise(function(resolve, reject) {
      jsdom.env({
        url: "https://www.reddit.com/r/aww/",
        scripts: ["http://code.jquery.com/jquery.js"],
        done: (err, page) => err ? reject(err) : resolve(page)
      });
    }
  );
}

function getLinks(page) {
  console.log('Parsing');
  const allLinks = [];
  const $ = page.$;
  const links = $('.title.may-blank');
  links.each(function () {
    const element = $(this);
    allLinks.push({
      text: element.text(),
      href: element.attr('href'),
    })
  });

  return allLinks;
}

function correctImgurUrls(links) {
  console.log('Correcting imgur urls');
  return links.reduce(function (correctedLinks, link) {
    if (link.href.indexOf('imgur') > -1 && !(link.href.endsWith('.jpg') ||
      link.href.endsWith('.png') || link.href.endsWith('.gif')) ) {
        const jpg = Object.assign({}, link);
        jpg.href = jpg.href + '.jpg';
        correctedLinks.push(jpg);

        const gif = Object.assign({}, link);
        gif.href = gif.href + '.gif';
        correctedLinks.push(gif);
    } else {
      correctedLinks.push(link);
    }
    return correctedLinks;
  }, []);
}

function removeRedditReferences(links) {
  console.log('Removing reddit references');
  return links.filter(link => !(
    link.text.indexOf('/r/') > -1 ||
    link.text.indexOf('reddit') > -1 ||
    link.text.indexOf('Reddit') > -1)
  );
}

function validateLinks(context) {
  return links => {
    console.log("Validating urls");
    links.forEach(link => {
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
}

function parseFrontPage(context) {
  const subreddit = 'aww';
  fetchSubreddit(subreddit)
    .then(getLinks)
    .then(correctImgurUrls)
    .then(removeRedditReferences)
    .then(validateLinks(context))
    .catch(error => console.error("Error fetching subreddit", subreddit, error));
}


module.exports = parseFrontPage;
