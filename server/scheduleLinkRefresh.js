var cron = require('node-cron');
const fetchSubredditLinks = require('./fetchSubredditLinks');
const globals = require('./globals');
const database = require('./database');
const renderTemplate = require('./rendering/renderTemplate');

function fetchAllSubreddits(subreddits, context) {
  subreddits.forEach(subreddit => {
    fetchSubredditLinks(subreddit, context)
    .then(links => {
      console.log("Updated subreddit: ", subreddit);
      context[subreddit] = links
      return links;
    })
    .then(links => renderTemplate(links, subreddit))
    .then(addLinksToDb)
    .catch(error => console.error("Error storing subreddit:", subreddit, error));
  });
}

function addLinksToDb(links) {
  database.insertLinks(links)
}

function scheduleLinkRefresh(subreddits, context) {
  console.log('Fetching all subreddits');
  fetchAllSubreddits(subreddits, context);

  console.log('Scheduling Link Refresh');
  cron.schedule(globals.chronInterval, () => {
    console.log('Refreshing links');
    fetchAllSubreddits(subreddits, context);
  });
}


module.exports = scheduleLinkRefresh;
