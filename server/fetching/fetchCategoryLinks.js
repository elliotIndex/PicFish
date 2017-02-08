const request = require('request');
const jsdom = require('jsdom');
const utils = require('../misc/utils');
const globals = require('../globals');
const database = require('../database/database');
const validate = require('../validation/validate');
const shuffle = require('knuth-shuffle').knuthShuffle

function fetchPages(category) {
  console.log("Fetching category", category)
  const pages = globals.categories[category].map(source => new Promise(
    (resolve, reject) => {
      const url = utils.makeUrlOutOf(source);
      jsdom.env({
        url,
        scripts: ['http://code.jquery.com/jquery.js'],
        done: (err, page) => err ? reject(err) : resolve({ page, category })
      });
    }
  ));

  return Promise.all(pages);
}

function scrapeLinks(pages) {
  const allLinks = []; // Promises

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

  return Promise.all(shuffle(allLinks));
}

function removeInvalidLinks(links) {
  return Promise.all(links.map(linkToAdd => {
    return database.isInvalidLinkId(linkToAdd.linkId)
    .then(isInvalid => isInvalid ? null : linkToAdd);
  }))
  .then(linksToFilter => linksToFilter.filter(i => i));
}

function removeDuplicateLinks(links) {
  return Promise.all(links.map(linkToAdd => {
    return database.findLink({ text: linkToAdd.text })
    .then(foundLink => {
      if (!foundLink) {
        return linkToAdd;
      }
      return null;
    })
  }))
  .then(linksToFilter => linksToFilter.filter(i => i));
}

function correctImgurUrls(links) {
  return links.reduce(function (correctedLinks, link) {
    if (link.href.indexOf('imgur') > -1) {
      if (link.href.endsWith('.gifv')) {
        link.href = link.href.replace('gifv', 'gif');
      } else if (
        !(
          link.href.endsWith('.jpg') ||
          link.href.endsWith('.png') ||
          link.href.endsWith('.gif')
        )
      ) {
          const jpg = Object.assign({}, link);
          jpg.href = jpg.href + '.jpg';
          jpg.linkId = utils.generateHashCode(jpg.href);
          correctedLinks.push(jpg);

          const gif = Object.assign({}, link);
          gif.href = gif.href + '.gif';
          gif.linkId = utils.generateHashCode(gif.href);
          correctedLinks.push(gif);
        }
      }
      correctedLinks.push(link);
      return correctedLinks;
    }, []);
  }


  function validateLinks(links) {
    console.log("Validating", links.length, "links");
    return utils.asyncMap(links, validate)
    .then(links => {
      console.log("Found", links.length, "valid links");
      return links.map(link => {
        link.fbThumbnail = utils.getThumbnail(
          link.href, link.size, globals.maxFbThumbnailBytes
        );
        link.twThumbnail = utils.getThumbnail(
          link.href, link.size, globals.maxTwThumbnailBytes
        );
        delete link.size;
        return link;
      })
    });
  }

  function fetchCategoryLinks(category) {
    return fetchPages(category)
    .then(scrapeLinks)
    .then(removeDuplicateLinks)
    .then(correctImgurUrls)
    .then(removeInvalidLinks)
    .then(utils.removeRedditReferences)
    .then(utils.removeNSFWlinks)
    .then(utils.removeOC)
    .then(validateLinks)
    .then(utils.filterUniqueLinks)
    .catch(error => console.error(error));
  }


  module.exports = fetchCategoryLinks;
