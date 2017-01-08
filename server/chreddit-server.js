const express = require('express');
const app = express();
const path = require('path');
const scheduleLinkRefresh = require('./scheduleLinkRefresh');
const globals = require('./globals');
const cleanup = require('./cleanup');
const database = require('./database');
const environment = require('./environment');
const findOrCreatefile = require('./findOrCreatefile');
const utils = require('./utils');

globals.renderedSubredditsDir = __dirname + '/renderedSubreddits/';
globals.renderedSharedLinksDir = __dirname + '/renderedSharedLinks/';

app.use(express.static('../client'));

app.get('/:terminal', function (req, res) {

  if (!req.params.terminal) {
    console.log("Serving default subreddit");
    res.sendFile(path.resolve(globals.renderedSubredditsDir + globals.subreddits[0] + '.html'));
  } else if (utils.isSubreddit(req.params.terminal)) {
    console.log("Serving subreddit");
    res.sendFile(path.resolve(globals.renderedSubredditsDir + req.params.terminal + '.html'));
  } else if (utils.isLinkId(req.params.terminal)) {
    console.log("Serving shared link");
    findOrCreatefile(req.params.terminal) // resolves with filepath, rejects if id not found
    .then(filename => {
      console.log("Sending back file", globals.renderedSharedLinksDir + filename);
      res.sendFile(globals.renderedSharedLinksDir + filename);
    })
    .catch(err => res.sendFile(defaultLinkPath));
  } else { // remove this one
    res.sendFile(path.resolve(__dirname + '/../client/index.html'));
  }
});

app.listen(environment.port, function () {
  console.log('Express server connected');
});

database.connect();

cleanup.prepForServerShutdown(database.close);

scheduleLinkRefresh(globals.subreddits);
