const environment = require('./config/environment');

const globals = {
  categories: {
    'funny': [ 'funny', 'BlackPeopleTwitter', 'memes', 'Unexpected' ],
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
  linkRefreshInterval: '30 * * * *', // hourly on the **:30
  fileCleanupInterval: '1 0 * * *', // daily at 12:01am
  linkCleanupInterval: '17 3 * * *', // daily at 3:10 AM
  renderedCategoriesDir: __dirname + '/fileCache/renderedCategories/',
  renderedSharedLinksDir: __dirname + '/fileCache/renderedSharedLinks/',
  stylesheetDir: __dirname + '/style.css',
  staticFileDir: __dirname + '/static',
  faviconDir: __dirname + '/static/favicon/favicon.ico',
  maxFbThumbnailBytes: 8000000, // < 8 MB
  maxTwThumbnailBytes: 100000000, // < 100 MB (no limit on twitpics)
  defaultThumbnailUrl: 'http://www.pic.fish/logo.png',
  maxValidationRequestTime: 20000, // 10 s
}

if (environment.mode === 'dev' && process.argv.indexOf('short') > -1) {
  temp = {};
  temp[globals.defaultCategory] = globals.categories[globals.defaultCategory];
  globals.categories = temp;
}

module.exports = globals;
