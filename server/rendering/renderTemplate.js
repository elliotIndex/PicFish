var mu = require('mu2'); // notice the '2' which matches the npm repo, sorry..
var fs = require('fs');
var utils = require('../utils');

mu.root = __dirname + '/templates';

module.exports = (links, filename, folder) => {
  return new Promise((resolve, reject) => {
    const filepath = './' + folder + '/' + filename;
    const wstream = fs.createWriteStream(filepath);
    const muStream = mu.compileAndRender('index.html', { links });

    muStream.on('data', (renderedStream) => wstream.write(renderedStream));

    muStream.on('end', () => {
      console.log('Finished rendering', filename);
      // To make sure all writing has finished before closing stream
      setTimeout(() => {
        wstream.end();
        resolve(filename);
      }, 0);
    });

    muStream.on('error', () => reject(error));
  });
}
