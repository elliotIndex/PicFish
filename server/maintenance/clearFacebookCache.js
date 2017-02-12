const request = require('request');

module.exports = (terminal) => {
  request.post(
    'https://graph.facebook.com',
    { id: 'http://www.pic.fish/' + terminal, scrape: true },
    () => {}
  );
};
