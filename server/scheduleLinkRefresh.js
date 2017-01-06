var cron = require('node-cron');
const fetchSubredditLinks = require('./fetchSubredditLinks');

function scheduleLinkRefresh(context) {
  console.log('Scheduling Link Refresh');
  cron.schedule('* * * * *', function(){
    console.log('Refreshing links');
    fetchSubredditLinks('funny', context);
    fetchSubredditLinks('aww', context);
    fetchSubredditLinks('pics', context);
    fetchSubredditLinks('gifs', context);
  });
}


module.exports = scheduleLinkRefresh;
