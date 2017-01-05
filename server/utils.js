module.exports = {
  hasLink: function(links, link) {
    return links.some(containedLink => link.text === containedLink.text);
  },

  isImageResponse: function(res) {
    return ~res.headers['content-type'].indexOf('image');
  }
}
