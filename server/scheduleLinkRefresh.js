const cron = require('node-cron');
const fetchSubredditLinks = require('./fetchSubredditLinks');
const globals = require('./globals');
const database = require('./database');
const clearFacebookCache = require('./clearFacebookCache');
const utils = require('./utils');
const renderTemplate = require('./rendering/renderTemplate');

function fetchAllSubreddits(subreddits) {
  for (let picFishSub in subreddits) {
    const subredditLinks = fetchSubredditLinks(subreddits[picFishSub]);

    subredditLinks
    .then(links => renderTemplate(
      links,
      picFishSub + '.html',
      globals.renderedSubredditsDir,
      utils.toTitleCase(picFishSub)
    ))
    .catch(error => console.error("Error rendering subreddit:", subreddit, error))
    .then(() => clearFacebookCache(picFishSub));

    subredditLinks
    .then(links => database.insertLinks(links))
    .catch(error => console.error("Error storing subreddit:", subreddit, error));
  }
}

function scheduleLinkRefresh(subreddits) {
  renderDevPage();

  console.log('Fetching all subreddits');
  fetchAllSubreddits(subreddits);

  console.log('Scheduling Link Refresh');
  cron.schedule(globals.linkRefreshInterval, () => {
    console.log('Refreshing links');
    fetchAllSubreddits(subreddits);
  });
}

function renderDevPage() {
  renderTemplate(
    [globals.defaultLink, globals.defaultLink, globals.defaultLink],
    "dev.html",
    globals.renderedSubredditsDir,
    "Dev"
  )
  .then(() => console.log("Rendered dev page"))
}


module.exports = scheduleLinkRefresh;
