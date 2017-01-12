$('#share-link-modal').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget);
  var shareLink = button.data('link');
  var modal = $(this);
  modal.find('#copy-target').text(shareLink);
  modal.find('#copy-link').attr('href', 'http://' + shareLink);
})

function copyToClipboard() {
  var copyTarget = document.getElementById("copy-target");
  var range = document.createRange();

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
  }, 50);
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
