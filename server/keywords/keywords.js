const cuteText = require('./texts/cute.js');
const gifsText = require('./texts/gifs.js');
const funnyText = require('./texts/funny.js');
const generalText = require('./texts/general.js');
const gamingText = require('./texts/gaming.js');

const textMap = {
  cute: cuteText,
  gifs: gifsText,
  funny: funnyText,
  general: generalText,
  gaming: gamingText,
}

function keywords(category = 'general') {
  const categoryTexts = textMap[category];
  return categoryTexts.join(' ');
}

module.exports = keywords;
