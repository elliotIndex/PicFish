var cron = require('node-cron');
const fetchSubredditLinks = require('./fetchSubredditLinks');
const globals = require('./globals');

function fetchAllSubreddits(subreddits, context) {
  subreddits.forEach(subreddit => fetchSubredditLinks(subreddit, context));
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
