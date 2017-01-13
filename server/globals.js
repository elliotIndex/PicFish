const environment = require('./environment');

const globals = {
  subreddits: {
    'funny': 'funny',
    'cute': 'aww',
    'pics': 'pics',
    'gifs': 'gifs',
    'gaming': 'gaming',
    'earth': 'earthPorn',
  },
  defaultLink: {
    text: "Uh oh! We couldn't find the picture you were looking for. We'll try to fix it on our end :)",
    href: 'http://imgur.com/PbcZq8t.jpg',
    linkId: 47378
  },
  defaultFilename: __dirname + '/renderedSharedLinks/defaultLink.html',
  linkRefreshInterval: '30 * * * *', // hourly on the **:30
  fileCleanupInterval: '1 0 * * * *', // daily at 12:01am
  renderedSubredditsDir: __dirname + '/renderedSubreddits/',
  renderedSharedLinksDir: __dirname + '/renderedSharedLinks/',
  stylesheetDir: __dirname + '/style.css',
  staticFileDir: __dirname + '/static',
  maxThumbnailBytes: 8000000, // < 8 MB
  defaultThumbnailUrl: "http://www.pic.fish/logo.png",
  maxValidationRequestTime: 20000, // 10 s
}

if (environment.mode === "dev" && process.argv.indexOf('short')) {
  globals.subreddits = { 'cute': 'aww' };
}

module.exports = globals;
