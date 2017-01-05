module.exports = {
  hasLink: function(context, subreddit, link) {
    return context[subreddit] &&
      context[subreddit].linkList.some(containedLink => link.text === containedLink.text);
  },

  isImageResponse: function(res) {
    return ~res.headers['content-type'].indexOf('image');
  }
}
