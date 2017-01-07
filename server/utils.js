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
  }

}
