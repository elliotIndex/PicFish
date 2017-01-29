const globals = require('../globals');
const database = require('../database/database');
const utils = require('../misc/utils');
const request = require('request');

function removeDeadLink(link) {
  return checkLink(link)
  .catch(() => database.removeLink(link))
}

function checkLink(link) {
  return new Promise((resolve, reject) => {
    request(
      { uri: link.href, timeout: globals.maxValidationRequestTime },
      (error, response, body) => {
        if ( !error && response.statusCode === 200 && utils.isImageResponse(response) ) {
          resolve(link);
        } else {
          reject(link);
        }
      }
    );
  })
}

module.exports = removeDeadLink;
