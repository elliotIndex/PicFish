const request = require('request');
const jsdom = require('jsdom');
const utils = require('../misc/utils');
const globals = require('../globals');
const database = require('../database/database');
const shuffle = require('knuth-shuffle').knuthShuffle

const validate = linkOrUri => {
  let link = {};
  if (typeof linkOrUri === "string") {
    link.href = linkOrUri;
    link.linkId = utils.generateHashCode(linkOrUri);
  } else {
    const link = linkOrUri;
  }
  return new Promise((resolve, reject) => {
    request(
      { uri: link.href, timeout: globals.maxValidationRequestTime },
      (error, response, body) => {
        if (
          !error &&
          response.statusCode === 200 &&
          utils.isImageResponse(response)
        ) {
          link.size = response.headers['content-length'];
          resolve(link);
        } else {
          database.insertInvalidLinkId(link.linkId)
          .then(reject)
        }
      }
    );
  })
}

module.exports = validate;
