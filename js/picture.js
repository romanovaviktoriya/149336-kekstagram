'use strict';
(function () {
  // var PICTURES_COUNT = 25;
  //
  // var pictureListElement = document.querySelector('.pictures');

  var templateElement = document.querySelector('#picture-template').content.querySelector('.picture');
  // var pictures = [];

  window.renderPhoto = function (object) {
    var pictureElement = templateElement.cloneNode(true);

    pictureElement.querySelector('img').src = object.src;
    pictureElement.querySelector('.picture-likes').textContent = object.likes;
    pictureElement.querySelector('.picture-comments').textContent = object.comments.length;

    return pictureElement;
  };

  // var fragmentElement = document.createDocumentFragment();
  // for (var i = 0; i < PICTURES_COUNT; i++) {
  //   fragmentElement.appendChild(window.renderPhoto(pictures[i]));
  // }
  // pictureListElement.appendChild(fragmentElement);
})();
