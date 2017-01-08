const cron = require('node-cron');
const fetchSubredditLinks = require('./fetchSubredditLinks');
const globals = require('./globals');
const database = require('./database');
const renderTemplate = require('./rendering/renderTemplate');

function fetchAllSubreddits(subreddits) {
  subreddits.forEach(subreddit => {
    const subredditLinks = fetchSubredditLinks(subreddit);

    subredditLinks
    .then(links => renderTemplate(links, subreddit + '.html', 'renderedSubreddits'))
    .catch(error => console.error("Error rendering subreddit:", subreddit, error));

    subredditLinks
    .then(links => database.insertLinks(links))
    .catch(error => console.error("Error storing subreddit:", subreddit, error));
  });
}

function scheduleLinkRefresh(subreddits) {
  console.log('Fetching all subreddits');
  fetchAllSubreddits(subreddits);

  console.log('Scheduling Link Refresh');
  cron.schedule(globals.linkRefreshInterval, () => {
    console.log('Refreshing links');
    fetchAllSubreddits(subreddits);
  });
}


module.exports = scheduleLinkRefresh;
