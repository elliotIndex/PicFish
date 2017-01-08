var mu = require('mu2'); // notice the '2' which matches the npm repo, sorry..
var fs = require('fs');
var utils = require('../utils');

mu.root = __dirname + '/templates';

module.exports = (links, filename) => {
  const filepath = utils.createFilePath(filename)

  const wstream = fs.createWriteStream('./rendered/' + filename + '.html');

  const muStream = mu.compileAndRender('index.html', { links });

  muStream.on('data', (renderedStream) => wstream.write(renderedStream));

  muStream.on('end', () => {
    console.log('Finished rendering', filename);
    wstream.end();
  });

  return links;
}
