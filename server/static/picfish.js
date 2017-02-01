// Variable declarations
var $shareLinkModal = $('#share-link-modal');
var $toggleHeight = $(".toggle-height");
var $scrollableContent = $window = $(window);
var $imageList = $body = $('body');
var $navbarToggle = $(".navbar-toggle");
var $navbar = $("#navbar");
var $topNav = $(".navbar.navbar-default");
var $loadingSpinner = $(".loading-spinner");

// Page setup
$scrollableContent.focus();
$navbarToggle.on('blur', function() { $navbar.collapse('hide'); });
$shareLinkModal.on('hide.bs.modal', resetShareModal);
scrollingNav();
scrollRequests();
insertAd();

// Toggle height
var fitHeight = true;
if (localStorage && localStorage.getItem("fitHeight") === "false") {
  fitHeight = false;
}
function updateViewFitHeight() {
  $(".toggle-height").text((fitHeight ? "Expand" : "Shrink") + " Pictures");
  $body.find('#toggle-height').remove();
  if (fitHeight) {
    $body.append($('<style type="text/css" id="toggle-height"> .link-img { max-height: 100%; } .img-container { height: 70%; } </style>'));
  }
}
function toggleFitToHeight() {
  fitHeight = !fitHeight;
  var previousPosition = getCurrentPosition();
  updateViewFitHeight();
  goToPosition(previousPosition);
  $toggleHeight.blur();
  localStorage.setItem("fitHeight", fitHeight);
}
updateViewFitHeight();
$toggleHeight.click(toggleFitToHeight);

// Social
var FB = null;
var fbShareBtnStrs = [
  '<div class="fb-share-button" data-href="http://www.pic.fish/',
  '" data-layout="button" data-size="large" data-mobile-iframe="false"><a class="fb-xfbml-parse-ignore" target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fwww.pic.fish%2F',
  '&amp;src=sdkpreparse">Share</a></div>'
];

var twttrParts = [
  '<iframe class="pf-twitter" src="https://platform.twitter.com/widgets/tweet_button.html?size=l&url=http%3A%2F%2Fwww.pic.fish%2F',
  // terminal
  '&text=',
  // text joined with %20
  '&hashtags=PicFish%2C',
  // hashtag
  '" width="78" height="28" via="pic_fish" title="',
  // title
  '" style="border: 0; overflow: hidden;"> </iframe>'
]

// Share modal
$shareLinkModal.on('show.bs.modal', function (event) {
  var modal = $(this);
  var button = $(event.relatedTarget);

  var socialBtns = modal.find('#social-buttons')
  var shareImage = modal.find('#share-img')
  var copyTarget = modal.find('#copy-target')
  var copyLink = modal.find('#copy-link')

  var shareLink = button.data('link');
  var imgSrc = button.data('imgsrc');
  var linkId = button.data('linkid') || '';
  var linkText = button.data('linktext') || '';
  var linkURL = 'http://' + shareLink;

  $navbar.collapse('hide');

  copyTarget.text(shareLink);
  copyLink.attr('href', linkURL);
  shareImage.attr('src', imgSrc);

  var fbAnchor = $(fbShareBtnStrs.join(linkId));
  if (FB) {
    modal.find('#social-buttons').append(fbAnchor);
    socialBtns.append(fbAnchor);
    FB.XFBML.parse();
  }
  var hashTag = window.location.pathname.slice(1);
  hashTag = isNaN(parseInt(hashTag)) ? hashTag : "picOfTheDay";
  var twtrAnchor = $(
    twttrParts[0] + linkId +
    twttrParts[1] + encodeURI("PicFish - " + linkText) +
    twttrParts[2] + hashTag +
    twttrParts[3] + "MYTITLE" +
    twttrParts[4]
  );
  socialBtns.append(twtrAnchor);
});

// Misc
function resetShareModal(event) {
  setTimeout(function() {
    $('.modal-title').text("Share Link");
    $('#social-buttons').empty();
  }, 500);
}
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

// Scrolling navbar
function scrollingNav() {
  var didScroll;
  var lastScrollTop = 0;
  var delta = 10;
  var navbarHeight = $topNav.outerHeight();

  // on scroll, let the interval function know the user has scrolled
  $scrollableContent.scroll(function(event){
    didScroll = true;
  });
  // run hasScrolled() and reset didScroll status
  setInterval(function() {
    if (didScroll) {
      hasScrolled();
      didScroll = false;
    }
  }, 100);

  function hasScrolled() {
    var st = $scrollableContent.scrollTop();
    if (Math.abs(lastScrollTop - st) < delta) {
      return false;
    }

    if (st > lastScrollTop && st > navbarHeight) {
      $topNav.removeClass('nav-down').addClass('nav-up');
    } else if (st < lastScrollTop || st < navbarHeight) {
      $topNav.removeClass('nav-up').addClass('nav-down');
    }
    lastScrollTop = st;
  }
}

// Scroll requests
var requestSent = false;
var errorCount = 0;
function scrollRequests() {
  if ($imageList.find('.list-entry').length > 1) {
    $scrollableContent.scroll(makeScrollRequest);
  }
}
function makeScrollRequest() {
  if (!requestSent && nearPageEnd()) {
    $lastLink = $('.list-entry').last();
    var index = $lastLink.data('categoryindex');
    if (window.location.pathname === '/') {
      index = $lastLink.data('totalindex')
    }
    requestSent = true;
    startSpinner();

    $.get( window.location.pathname + '?index=' + index)
    .done(function(response) {
      addLinks(response);
    })
    .fail(function(err) {
      console.log('Error Loading Links:', err);
      errorCount++;
      if (errorCount > 10) {
        endRequests();
      }
    })
    .always(function() {
      requestSent = false;
      stopSpinner();
    });
  }
}
function nearPageEnd() {
  var $le = $('.list-entry');
  var threeFromEnd = $le.length - 3;
  return $scrollableContent.scrollTop() > $($le[threeFromEnd]).offset().top;
}

// Add links
function addLinks(links) {
  if (links.length === 0) {
    endRequests()
  }

  var adAdded = false;
  // use jquery to tack links onto list
  links.forEach(function(link, index) {
    var newLink = $(
      ' <a name="'+
      link.linkId +
      '" class="link-anchor"> <li class="list-entry" data-toggle="modal" data-target="#share-link-modal" data-linkid="' +
      link.linkId +
      '" data-categoryIndex="' +
      link.categoryIndex +
      '" data-totalIndex="' +
      link.totalIndex +
      '" data-linktext="' +
      link.text +
      '" data-imgsrc="' +
      link.href +
      '" data-link="' +
      window.location.host +
      '/' +
      link.linkId +
      '" > <div class="img-container"> <img src="' +
      link.href +
      '" class="link-img" alt="' +
      link.text +
      '" /> </div> <div class="text-container"> <h3 class="link-title"> ' +
      link.text +
      ' </h3> </div> </li> </a>'
    );
    $imageList.append(newLink);
    if (!adAdded && index > 0 && Math.floor(Math.random() * (6 - index)) === 0) {
      adAdded = true;
      insertAd();
    }
  });
}
function startSpinner() {
  $loadingSpinner.show();
}
function stopSpinner() {
  $loadingSpinner.hide();
}
function endRequests() {
  console.log("ending!");
  $scrollableContent.unbind('scroll', makeScrollRequest);
  $imageList.append($(
    '<div class="header-text main">That\'s it! You\'ve seen all the images. Why don\'t you try out a new category?</div>'
  ));
}

// Insert Ads
function insertAd() {
  $imageList.append($('<script src="http://bdv.bidvertiser.com/BidVertiser.dbm?pid=758861&bid=1865729" type="text/javascript"></script>='));
}

// Prevent oversize ads
$window.resize(enforceMaxAdWidth)
enforceMaxAdWidth();
function enforceMaxAdWidth() {
  $body.find('#page-width').remove();
  var maxWidth = Math.min($window.width(), 336);
  $body.append($('<style type="text/css" id="page-width"> body>iframe { max-width: ' + maxWidth + 'px; } </style>'));
}

// Don't change position on resize
function getCurrentPosition() {
  var anchors = Array.from($('.link-anchor'));
  var minOffset = anchors.reduce((minOffset, anchor) => Math.min(minOffset, $(anchor).offset().top), Infinity);
  return anchors.reduce((bestFit, lAnchor, index, anchors) => {
    if (bestFit) {
      return bestFit;
    }
    if ($(lAnchor).offset().top > $body.scrollTop() + minOffset) {
      if (index > 0) {
        return anchors[index - 1];
      }
      return lAnchor;
    }
    return null;
  }, null);
}
function goToPosition(element) {
  $('html, body').animate({
    scrollTop: $(element).offset().top - 60
  }, 1);
}
