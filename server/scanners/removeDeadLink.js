const cleanup = require('../maintenance/cleanup');

module.exports = (link, done) => {
  return cleanup.validateOrDelete(link.href)
  .then(done)
  .catch(error => {
    utils.standardError(error);
    done();
  });
}
