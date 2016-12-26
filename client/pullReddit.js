function pullReddit() {
  console.log('Pulling reddit!')
  $.get('frontpage', function(response) {
    console.log('Building list!', response)
    buildRedditList(response);
  });
}
// Shorthand for $( document ).ready()
$(function() {
  console.log('ready!');
  pullReddit();
});

function buildRedditList(links) {
  var imageList = $('#image-list');
  links.forEach(function (link) {
    imageList.append(buildListItem(link));
  });
}

function buildListItem(link) {
  var listItem = $('<li>'); // , { 'class': 'list-group-item'});
  var anchor = $('<h3>', { text: link.text, class: 'link-title' });
  var image = $('<img>', { src: link.href, class: 'link-img' });
  listItem.append(anchor);
  listItem.append(image);
  return listItem;
}

console.log('Built list');
