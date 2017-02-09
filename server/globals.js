const environment = require('./config/environment');

const globals = {
  categories: {
    'funny': [ 'funny', 'memes', 'Unexpected' ],
    'cute': [ 'aww', 'wholesomegifs', 'user/316nuts/m/superaww', 'BearCubGIFs', 'Otters', 'puppies' ],
    'general': [ 'pics', 'mildlyinteresting', 'woahdude' ],
    'gifs': [ 'gifs', 'reactiongifs' ],
    'gaming': [ 'gaming' ],
  },
  defaultLink: {
    text: 'Uh oh! We couldn\'t find the picture you were looking for. We\'ll try to fix it on our end :)',
    href: 'http://imgur.com/PbcZq8t.jpg',
    linkId: 47378
  },
  defaultCategory: 'cute',
  errorFilename: __dirname + '/fileCache/renderedSharedLinks/defaultLink.html',
  // NOTE: DROPLET IS ON EASTERN TIME
  linkRefreshInterval: '30 * * * *', // hourly on the **:30
  fileCleanupInterval: '10 7 * * *', // daily at 7:10 AM
  linkCleanupInterval: '17 5 * * *', // daily at 5:17 AM
  invalidLinkCleanupInterval: '20 4 * * *', // daily at 4:20 AM
  renderedCategoriesDir: __dirname + '/fileCache/renderedCategories/',
  renderedSharedLinksDir: __dirname + '/fileCache/renderedSharedLinks/',
  stylesheetDir: __dirname + '/style.css',
  staticFileDir: __dirname + '/static',
  faviconDir: __dirname + '/static/favicon/favicon.ico',
  maxNewImages: 20, // prevent server crashing
  maxFbThumbnailBytes: 8000000, // < 8 MB
  maxTwThumbnailBytes: 10000000, // < 10 MB (no limit on twitpics)
  maxLinkSize: 10000000, // < 10 MB (no massive photos allowed)
  defaultThumbnailUrl: 'http://www.pic.fish/logo.png',
  maxValidationRequestTime: 20000, // 10 s
}

if (environment.mode === 'dev' && process.argv.indexOf('short') > -1) {
  temp = {};
  temp[globals.defaultCategory] = globals.categories[globals.defaultCategory];
  globals.categories = temp;
}

module.exports = globals;
