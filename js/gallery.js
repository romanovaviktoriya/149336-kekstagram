'use strict';
(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var PICTURES_COUNT = 25;
  var galleryOverlayElement = document.querySelector('.gallery-overlay');

  var pictureListElement = document.querySelector('.pictures');

  var pictures = window.generatePicturesArray();
  var fragmentElement = document.createDocumentFragment();
  for (var i = 0; i < PICTURES_COUNT; i++) {
    fragmentElement.appendChild(window.renderPhoto(pictures[i]));
  }
  pictureListElement.appendChild(fragmentElement);

  function sliderEscPressHandler(e) {
    if (e.keyCode === ESC_KEYCODE) {
      closeSlider();
    }
  }

  function openSlider() {
    event.preventDefault();
    galleryOverlayElement.classList.remove('hidden');
    document.addEventListener('keydown', sliderEscPressHandler);
  }

  function closeSlider() {
    galleryOverlayElement.classList.add('hidden');
    document.removeEventListener('keydown', sliderEscPressHandler);
  }
  var slidersOpenElement = document.querySelectorAll('.picture');
  var sliderCloseElement = galleryOverlayElement.querySelector('.gallery-overlay-close');

  sliderCloseElement.tabIndex = 0;

  function openPhotoHandler(e) {
    e.preventDefault();
    var el = e.currentTarget.children[0];
    window.renderMainPhoto(el);
    openSlider();
  }

  for (var j = 0; j <= slidersOpenElement.length - 1; j++) {
    slidersOpenElement[j].addEventListener('click', openPhotoHandler, true);
  }

  sliderCloseElement.addEventListener('click', function () {
    closeSlider();
  });

  sliderCloseElement.addEventListener('keydown', function (e) {
    if (e.keyCode === ENTER_KEYCODE) {
      closeSlider();
    }
  });
})();
