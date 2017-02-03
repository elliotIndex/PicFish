const globals = require('../globals');
const environment = require('../config/environment');

const utils = {
  isImageResponse: (res) => {
    return ~res.headers['content-type'].indexOf('image');
  },

  isLinkId: (item) => item && !isNaN(parseInt(item)),

  getResolvedPromises: (promises) => {
    const FAIL_TOKEN = {};

    return Promise.all(
      promises.map(p => p.catch(e => FAIL_TOKEN))
    ).then(
      values => values.filter(v => v !== FAIL_TOKEN)
    );
  },

  filterUniqueLinks: (links) => {
    const uniqIds = new Set();
    return links.reduce((uniqLinks, link) => {
      if (!uniqIds.has(link.linkId)) {
        uniqLinks.push(link);
      }
      uniqIds.add(link.linkId);
      return uniqLinks;
    }, []);
  },


  removeRedditReferences: (links) => {
    return links.filter(link => !(
      link.text.indexOf('r/') > -1 ||
      link.text.indexOf('reddit') > -1 ||
      link.text.indexOf('Reddit') > -1)
    );
  },

  removeNSFWlinks: (links) => links.filter(link => link.text.indexOf('nsfw') !== 0),

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
    return now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
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

  // Async loop method, iterates to nex item in array only after it has finished
  // previous item
  forEachAsync: (items, callback, index = 0) => {
    if (index >= items.length) {
      console.log("Finsihed Iterating!");
      return;
    }
    return callback(items[index], index, items)
    .then(() => utils.forEachAsync(items, callback, index + 1))
    .catch(error => {
      console.error("Error iterating on", items[index], error);
      return utils.forEachAsync(items, callback, index + 1);
    });
  },
}

module.exports = utils;
