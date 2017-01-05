const express = require('express');
const app = express();
const request = require('request');
const path = require('path');
const parseFrontPage = require('./parseFrontPage');
const utils = require('./utils');

const redditLinks = [];
const linkMap = {};

console.log('Fetching')
parseFrontPage(function (err, window) {
  console.log('Parsing');
  let allLinks = [];
  const $ = window.$;
  const links = $('.title.may-blank');
  links.each(function () {
    const element = $(this);
    allLinks.push({
      text: element.text(),
      href: element.attr('href'),
    })
  });
  console.log('Mapping');
  allLinks = allLinks.reduce(function (allLinks, link) {
    if (link.href.indexOf('imgur') > -1 &&
      !(link.href.endsWith('.jpg') ||
      link.href.endsWith('.png') ||
      link.href.endsWith('.gif')) ) {
        const jpg = Object.assign({}, link);
        const gif = Object.assign({}, link);

        jpg.href = jpg.href + '.jpg';
        gif.href = gif.href + '.gif';
        allLinks.push(jpg);
        allLinks.push(gif);
    } else {
      allLinks.push(link);
    }

    return allLinks;
  }, []);
  console.log('Filtering');
  allLinks = allLinks.filter(function (link) {
    if (
      link.text.indexOf('/r/') > -1 ||
      link.text.indexOf('reddit') > -1 ||
      link.text.indexOf('Reddit') > -1
    ) {
      return false;
    }
    return true;
  })
  allLinks.forEach(function (link) {
    request(link.href, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        if (utils.isImageResponse(response) && !utils.hasLink(redditLinks, link)){
          link.id = Math.floor(Math.random() * 10000000);
          linkMap[link.id] = link;
          redditLinks.push(link);
          console.log('pushed a link:', link.id);
        }
      }
    });
  });
});

app.use(express.static('../client'));

app.get('/frontpage', function (req, res) {
  console.log('Full page');
  res.send(redditLinks);
});

app.get('/:id', function (req, res) {
  console.log('Sharing page');
  res.sendFile(path.resolve(__dirname + '/../client/index.html'));
});

app.get('/picture/:id', function (req, res) {
  console.log('Sharing picture');
  const defaultLink = {
    text: 'Uh oh! We couldn\'t find the picture you were looking for. We\'ll try to fix it on our end :)',
    href: 'http://imgur.com/PbcZq8t.jpg',
    id: 47378
  };

  res.send([linkMap[req.params.id] || defaultLink]);
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
