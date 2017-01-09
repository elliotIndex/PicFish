module.exports = {
  subreddits: {
    'funny': 'funny',
    'cute': 'aww',
    'pics': 'pics',
    'gifs': 'gifs',
    'gaming': 'gaming',
    'earth': 'earthPorn',
  },
  defaultLink: {
    text: 'Uh oh! We couldn\'t find the picture you were looking for. We\'ll try to fix it on our end :)',
    href: 'http://imgur.com/PbcZq8t.jpg',
    linkId: 47378
  },
  defaultFilename: 'defaultLink.html',
  linkRefreshInterval: '30 * * * *', // hourly on the **:30
  fileCleanupInterval: '1 0 * * * *', // daily at 12:01am
  renderedSubredditsDir: __dirname + '/renderedSubreddits/',
  renderedSharedLinksDir: __dirname + '/renderedSharedLinks/',
  stylesheetDir: __dirname + '/style.css',

}
