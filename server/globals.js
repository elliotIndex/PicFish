module.exports = {
  subreddits: [
    'funny',
    'aww',
    'pics',
    'gifs',
  ],
  defaultLink: {
    text: 'Uh oh! We couldn\'t find the picture you were looking for. We\'ll try to fix it on our end :)',
    href: 'http://imgur.com/PbcZq8t.jpg',
    linkId: 47378
  },
  defaultFilename: 'defaultLink.html',
  linkRefreshInterval: '*/30 * * * *', // should be hourly
  fileCleanupInterval: '*/59 * * * *', // should be daily
}
