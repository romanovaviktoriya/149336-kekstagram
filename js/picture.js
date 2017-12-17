'use strict';
(function () {
  var templateElement = document.querySelector('#picture-template').content.querySelector('.picture');

  window.renderPhoto = function (object) {
    var pictureElement = templateElement.cloneNode(true);

    pictureElement.querySelector('img').src = object.url;
    pictureElement.querySelector('.picture-likes').textContent = object.likes;
    pictureElement.querySelector('.picture-comments').textContent = object.comments.length;

    return pictureElement;
  };
})();
