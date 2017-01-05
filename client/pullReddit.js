function pullReddit() {
  var param1 = window.location.pathname.slice(1);
  if (parseInt(param1)) {
    console.log("getting an individual pic");
    $.get('picture/' + param1, buildRedditList);
  } else if (param1) {
    console.log("getting a subreddit");
    $.get('sub/' + param1, buildRedditList);
  } else {
    console.log("getting the default subreddit");
    $.get('sub/aww' + param1, buildRedditList);
  }
}

// Shorthand for $( document ).ready()
$(function() { pullReddit(); });

function buildRedditList(links) {
  var imageList = $('#image-list');
  console.log("links", links)
  links.forEach(function (link) {
    imageList.append(buildListItem(link));
  });
}

function buildListItem(link) {
  var listItem = $('<li>', { class: 'list-entry' });
  var anchor = $('<h3>', { text: link.text, class: 'link-title' });
  var share = $('<h5>', { text: buildShareLink(link), class: 'link-share' });
  var image = $('<img>', { src: link.href, class: 'link-img' });
  listItem.append(anchor);
  listItem.append(share);
  listItem.append(image);
  return listItem;
}

function buildShareLink(link) {
  var host = window.location.host;
  return [host, link.id].join('/');
}
