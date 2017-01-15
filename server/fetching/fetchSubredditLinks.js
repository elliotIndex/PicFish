const request = require('request');
const jsdom = require('jsdom');
const utils = require('../misc/utils');
const globals = require('../globals');

function fetchSubreddit(subreddit) {
  return new Promise(function(resolve, reject) {
    jsdom.env({
      url: 'https://www.reddit.com/r/' + subreddit,
      scripts: ['http://code.jquery.com/jquery.js'],
      done: (err, page) => err ? reject(err) : resolve(page)
    });
  });
}

function scrapeLinks(page) {
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
    const unfilteredLinksPromise = links.map(link => {
      return new Promise((resolve, reject) => {
        request(
          { uri: link.href, timeout: globals.maxValidationRequestTime },
          (error, response, body) => {
            if (
              !error &&
              response.statusCode === 200 &&
              utils.isImageResponse(response)
            ) {
              link.fbThumbnail = utils.getThumbnail(
                link.href,
                response.headers['content-length'],
                globals.maxFbThumbnailBytes
              );
              link.twThumbnail = utils.getThumbnail(
                link.href,
                response.headers['content-length'],
                globals.maxTwThumbnailBytes
              );
              resolve(link);
            } else {
              reject('Invalid link');
            }
          }
        );
        // setTimeout(() => reject('Link timed out'), globals.maxValidationRequestTime);
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
  .then(utils.removeNSFWlinks)
  .then(utils.removeOC)
  .then(validateLinks(subreddit))
  .then(utils.filterUniqueLinks)
  .catch(error => console.error('Error fetching subreddit', subreddit, error));
}


module.exports = fetchSubredditLinks;
