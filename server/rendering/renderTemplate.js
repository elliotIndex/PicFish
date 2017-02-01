var mu = require('mu2'); // notice the '2' which matches the npm repo, sorry..
var fs = require('fs');
var utils = require('../misc/utils');
var environment = require('../config/environment');
var globals = require('../globals');

mu.root = __dirname + '/templates';

module.exports = (links, category, filename, filepath, title) => {
  return new Promise((resolve, reject) => {
    const fullFilepath = filepath + filename;

    const wstream = fs.createWriteStream(fullFilepath);
    const muStream = mu.compileAndRender('index.html', {
      links,
      title,
      category,
      domain: environment.domain,
      extension: filename.slice(0, -5),
      fbThumbnail: links[0].fbThumbnail,
      twThumbnail: links[0].twThumbnail,
    });

    muStream.on('data', (renderedStream) => {
      wstream.write(renderedStream)
    });

    muStream.on('end', () => {
      console.log('Finished rendering', filename);
      // To make sure all writing has finished before closing stream
      setTimeout(() => {
        wstream.end();
        resolve(filename);
      }, 10);
    });

    muStream.on('error', () => reject(error));
  });
}
