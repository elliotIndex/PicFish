const cleanup = require('../maintenance/cleanup');

function removeDeadLink(link, key, callback) {
  return cleanup.validateOrDelete(link.href).always(callback);
}

module.exports = removeDeadLink;
