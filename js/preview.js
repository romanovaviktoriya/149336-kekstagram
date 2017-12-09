'use strict';
(function () {
  var galleryOverlayElement = document.querySelector('.gallery-overlay');
  var pictures = [];

  function getMatchStr(object) {
    for (var i = 0; i < pictures.length; i++) {
      var str = object.src;
      var reg = pictures[i];
      var result = str.match(reg.src);
      if (result) {
        return [pictures[i].comments.length, pictures[i].likes];
      }
    }
    return [0, 0];
  }

  window.renderMainPhoto = function (object) {
    var matchStr = getMatchStr(object);
    galleryOverlayElement.querySelector('img').src = object.src;
    galleryOverlayElement.querySelector('.likes-count').textContent = matchStr[1];
    galleryOverlayElement.querySelector('.comments-count').textContent = matchStr[0];
  };
})();
