const cleanup = require('../maintenance/cleanup');

const removeDeadLink = (link, done) => {
  return cleanup.validateOrDelete(link.href)
  .then(() => done())
  .catch(error => {
    utils.standardError(error);
    done();
  });
}

module.exports = removeDeadLink;
