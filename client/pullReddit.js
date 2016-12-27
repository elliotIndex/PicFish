function pullReddit() {
  console.log('Pulling reddit!')
  var id = window.location.pathname.slice(1);
  console.log(id);
  if (id) {
    $.get('picture/' + id, function(response) {
      console.log('resp:', response);
      buildRedditList([response]);
    });
  } else {
    $.get('frontpage', function(response) {
      buildRedditList(response);
    });
  }
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
  return 'localhost:3000/share/' + link.id;
}
