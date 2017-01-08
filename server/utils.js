const globals = require('./globals');

module.exports = {
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
    console.log('Filtering unique links');
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
    console.log('Removing reddit references');
    return links.filter(link => !(
      link.text.indexOf('/r/') > -1 ||
      link.text.indexOf('reddit') > -1 ||
      link.text.indexOf('Reddit') > -1)
    );
  },

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
    return `./renderedSubreddits/${filename}.html`
  },

  isSubreddit: (terminal) => {
    return ~globals.subreddits.indexOf(terminal);
  }
}
