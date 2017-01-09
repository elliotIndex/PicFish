const path = require('path');
const globals = require('./globals');
const findOrCreateFile = require('./findOrCreateFile');

module.exports = {
  serveDefaultFile: (req, res) => {
    console.log("Serving default subreddit");
    res.sendFile(path.resolve(globals.renderedSubredditsDir + globals.subreddits['pics'] + '.html'));
  },

  serveSubreddit: (req, res, subreddit) => {
    console.log("Serving subreddit");
    res.sendFile(path.resolve(globals.renderedSubredditsDir + subreddit + '.html'));
  },

  serveLinkFile: (req, res, linkId) => {
    console.log("Serving shared link");
    findOrCreateFile(linkId) // resolves with filepath, rejects if id not found
    .then(filename => res.sendFile(globals.renderedSharedLinksDir + filename))
    .catch(err => res.sendFile(globals.renderedSharedLinksDir + globals.defaultFilename));
  },
}
