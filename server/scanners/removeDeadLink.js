const cleanup = require('../maintenance/cleanup');

function removeDeadLink(link, key, done) {
  return cleanup.validateOrDelete(link.href)
  .then(done)
  .catch(error => {
    utils.standardError(error);
    done();
  });
}

module.exports = removeDeadLink;
