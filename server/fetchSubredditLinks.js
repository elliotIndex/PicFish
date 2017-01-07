const request = require('request');
const jsdom = require("jsdom");
const utils = require('./utils');

function fetchSubreddit(subreddit) {
  return new Promise(function(resolve, reject) {
    jsdom.env({
      url: "https://www.reddit.com/r/" + subreddit,
      scripts: ["http://code.jquery.com/jquery.js"],
      done: (err, page) => err ? reject(err) : resolve(page)
    });
  });
}

function scrapeLinks(page) {
  console.log('Parsing');
  const allLinks = [];
  const $ = page.$;
  const links = $('.title.may-blank');
  links.each(function () {
    const element = $(this);
    const href = element.attr('href');
    allLinks.push({
      text: element.text(),
      href,
      linkId: utils.generateHashCode(href),
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


function validateLinks(subreddit) {
  return links => {
    console.log("Validating urls");
    const unfilteredLinksPromise = links.map(link => {
      return new Promise((resolve, reject) => {
        request(link.href, function (error, response, body) {
          if (
            !error &&
            response.statusCode === 200 &&
            utils.isImageResponse(response)
          ) {
            resolve(link);
          } else {
            reject("Invalid link");
          }
        });
      })
    });

    return utils.getResolvedPromises(unfilteredLinksPromise);
  }
}

function fetchSubredditLinks(subreddit) {
  return fetchSubreddit(subreddit)
  .then(scrapeLinks)
  .then(correctImgurUrls)
  .then(utils.removeRedditReferences)
  .then(validateLinks(subreddit))
  .then(utils.filterUniqueLinks)
  .catch(error => console.error("Error fetching subreddit", subreddit, error));
}


module.exports = fetchSubredditLinks;
