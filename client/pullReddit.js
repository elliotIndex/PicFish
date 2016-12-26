function pullReddit() {
  console.log('Pulling reddit!')
  $.get('frontpage', function(response) {
    buildRedditList(response);
  });
}

// Shorthand for $( document ).ready()
$(function() { pullReddit(); });

function buildRedditList(links) {
  var imageList = $('#image-list');
  links.forEach(function (link) {
    imageList.append(buildListItem(link));
  });
  console.log('Built list');
}

function buildListItem(link) {
  var listItem = $('<li>');
  var anchor = $('<h3>', { text: link.text, class: 'link-title' });
  var image = $('<img>', { src: link.href, class: 'link-img' });
  listItem.append(anchor);
  listItem.append(image);
  return listItem;
}
