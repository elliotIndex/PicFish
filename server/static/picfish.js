var fbShareBtnStrs = [
  '<div class="fb-share-button" data-href="https://www.pic.fish/',
  '" data-layout="button" data-size="large" data-mobile-iframe="true"><a class="fb-xfbml-parse-ignore" target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.pic.fish%2F',
  '&amp;src=sdkpreparse">Share</a></div>'
];

$('#share-link-modal').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget);
  var shareLink = button.data('link');
  var linkId = button.data('linkId') || '';
  var modal = $(this);
  modal.find('#copy-target').text(shareLink);
  modal.find('#copy-link').attr('href', 'http://' + shareLink);

  var fbAnchor = $(fbShareBtnStrs.join(linkId));
  modal.find('#social-buttons').append(fbAnchor);
});

$('#share-link-modal').on('hide.bs.modal', function (event) {
  setTimeout(function() {
    $('.modal-title').text("Share Link")
  }, 500);
});

function copyToClipboard() {
  var copyTarget = document.getElementById("copy-target");
  var range = document.createRange();

  $('.modal-title').text("Thanks for Sharing!");
  emptySelection();
  range.selectNode(copyTarget);
  window.getSelection().addRange(range);
  document.execCommand('copy');
  emptySelection();
  showCopy();
}

function emptySelection() {
  if (window.getSelection) {
     if (window.getSelection().empty) {  // Chrome
       window.getSelection().empty();
     } else if (window.getSelection().removeAllRanges) {  // Firefox
       window.getSelection().removeAllRanges();
     }
  } else if (document.selection) {  // IE?
    document.selection.empty();
  }
}

function showCopy() {
  var $copyTarget = $("#copy-target");
  $copyTarget.removeClass("normal-text");
  $copyTarget.addClass("success-text");
  setTimeout(function() {
    $copyTarget.removeClass("success-text");
    $copyTarget.addClass("normal-text");
  }, 250);
  setTimeout(function() {
    $copyTarget.removeClass("normal-text");
  }, 750);
}

var fitHeight = false;
var $toggleHeight = $(".toggle-height");
$toggleHeight.click(function toggleFitToHeight() {
  fitHeight = !fitHeight;
  $(".link-img").css("max-height", fitHeight ? "100%" : "");
  $(".img-container").css("height", fitHeight ? "80%" : "");
  $(".toggle-height").text((fitHeight ? "Expand" : "Shrink") + " Pictures");
  $toggleHeight.blur();
});
