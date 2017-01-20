const request = require('request');
const jsdom = require('jsdom');
const utils = require('../misc/utils');
const globals = require('../globals');

function fetchPages(category) {
  const pages = globals.categories[category].map(source => new Promise(
    (resolve, reject) => {
      jsdom.env({
        url: 'https://www.reddit.com/r/' + category,
        scripts: ['http://code.jquery.com/jquery.js'],
        done: (err, page) => err ? reject(err) : resolve({ page, category })
      });
    }
  ));

  return Promise.all(pages);
}

function scrapeLinks(pages) {

  const allLinks = [];

  pages.forEach(({ page, category }) => {
    const $ = page.$;
    const links = $('.thing.link');
    links.each((__, link) => {
      const $link = $(link);
      const href = $link.data('url');
      const text = $link.find('a.title').text();
      const linkId = utils.generateHashCode(href);

      allLinks.push({ text, href, category, linkId });
    });
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


function validateLinks(links) {
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
    })
  });

  return utils.getResolvedPromises(unfilteredLinksPromise);
}

function fetchCategoryLinks(category) {
  return fetchPages(category)
  .then(scrapeLinks)
  .then(correctImgurUrls)
  .then(utils.removeRedditReferences)
  .then(utils.removeNSFWlinks)
  .then(utils.removeOC)
  .then(validateLinks)
  .then(utils.filterUniqueLinks)
  .catch(error => console.error(error));
}


module.exports = fetchCategoryLinks;
