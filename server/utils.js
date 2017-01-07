module.exports = {
  hasLink: function(context, subreddit, link) {
    return context[subreddit] &&
      context[subreddit].some(containedLink => link.text === containedLink.text);
  },

  isImageResponse: function(res) {
    return ~res.headers['content-type'].indexOf('image');
  },

  getResolvedPromises: function(promises) {
    const FAIL_TOKEN = {};

    return Promise.all(
      promises.map(p => p.catch(e => FAIL_TOKEN))
    ).then(
      values => values.filter(v => v !== FAIL_TOKEN)
    );
  },

  filterUniqueLinks: function(links) {
    console.log('Filtering unique links');
    const uniqIds = new Set();
    return links.reduce((uniqLinks, link) => {
      if (!uniqIds.has(link.id)) {
        uniqLinks.push(link);
      }
      uniqIds.add(link.id);
      return uniqLinks;
    }, []);
  },


  removeRedditReferences: function(links) {
    console.log('Removing reddit references');
    return links.filter(link => !(
      link.text.indexOf('/r/') > -1 ||
      link.text.indexOf('reddit') > -1 ||
      link.text.indexOf('Reddit') > -1)
    );
  },

}
