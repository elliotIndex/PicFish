const globals = require('../globals');
const environment = require('../config/environment');
const EventEmitter = require('events');

const utils = {

  noOp: () => {},
  
  isImageResponse: (res) => {
    return ~res.headers['content-type'].indexOf('image');
  },

  isNotInvalidImgur: (res) => {
    if (res && res.request && res.request.uri) {
      return res.request.uri.path !== "/removed.png";
    }
    return true;
  },

  isLinkId: (item) => item && !isNaN(parseInt(item)),

  getResolvedPromises: (promises) => {
    const FAIL_TOKEN = {};

    return Promise.all( promises.map(p => p.catch(e => FAIL_TOKEN)) )
    .then( values => values.filter(v => v !== FAIL_TOKEN) );
  },

  filterUniqueLinks: (links) => {
    const uniqTexts = new Set();
    return links.reduce((uniqLinks, link) => {
      if (!uniqTexts.has(link.text)) {
        uniqLinks.push(link);
      }
      uniqTexts.add(link.linkId);
      return uniqLinks;
    }, []);
  },


  removeRedditReferences: (links) => {
    return links.filter(link => !(
      link.text.indexOf('r/') > -1 ||
      link.text.indexOf('reddit') > -1 ||
      link.text.indexOf('Reddit') > -1 ||
      link.text.indexOf('karma') > -1 ||
      link.text.indexOf('Karma') > -1)
    );
  },

  removeNSFWlinks: (links) => links.filter(link => (
    link.text.indexOf('nsfw') < 0 ||
    link.text.indexOf('rape') < 0 ||
    link.text.indexOf('fuck') < 0 ||
    link.text.indexOf('shit') < 0 ||
    link.text.indexOf('roofie') < 0
  )),

  removeOC: (links) => links.map(link => {
    link.text = link.text
    .replace(/ oc /ig, " ")
    .replace(/ oc$/ig, " ")
    .replace(/^oc /ig, " ")
    .replace(/\[oc\]/ig, "")
    .replace(/\(oc\)/ig, "")
    .replace("  ", " ")
    .trim()

    return link
  }),

  generateHashCode: (string) => {
    var hash = 0, i, chr, len;
    if (string.length === 0) return hash;
    for (i = 0, len = string.length; i < len; i++) {
      chr   = string.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    if (hash < 0) {
      hash = ~hash;
    }
    return hash.toString();
  },

  createFilePath: (filename) => {
    return `./server/renderedCategories/${filename}.html`
  },

  isCategory: (terminal) => {
    return globals.categories[terminal] || (terminal === "dev" && environment.mode === "dev");
  },

  getDate: () => {
    const now = new Date();

    // Date formatted as yyyy-mm-dd
    // eg, 2017-02-05
    return now.getFullYear() + '-' +
    ("0" + now.getMonth()).slice(-2) + '-' +
    ("0" + now.getDate()).slice(-2);
  },

  toTitleCase: (sentence) => {
    return sentence.split(' ').map(word => word[0].toUpperCase() + word.substring(1)).join(' ');
  },

  getThumbnail: (linkHref, size, maxSize) => {
    return size >= maxSize ? globals.defaultThumbnailUrl : linkHref
  },

  standardError: (error) => console.error(error),

  valueError: (returnVal) => {
    return (error) => {
      console.error(error)
      return returnVal;
    };
  },

  makeUrlOutOf: (source) => {
    if (source.split('/').length === 1) {
      return 'https://www.reddit.com/r/' + source;
    }
    return 'https://www.reddit.com/' + source
  },

  linkOrUriToLink: (linkOrUri) => {
    let link = {};
    if (typeof linkOrUri === "string") {
      link.href = linkOrUri;
      link.linkId = utils.generateHashCode(linkOrUri);
    } else {
      link = linkOrUri;
    }
    return link;
  }
}

module.exports = utils;
