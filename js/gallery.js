'use strict';
(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var galleryOverlayElement = document.querySelector('.gallery-overlay');
  var pictureListElement = document.querySelector('.pictures');
  var sliderCloseElement = galleryOverlayElement.querySelector('.gallery-overlay-close');

  window.successRenderPhotoHandler = function (picturesArray) {
    var fragment = document.createDocumentFragment();
    window.picturesArray = picturesArray;
    for (var j = 0; j < picturesArray.length; j++) {
      fragment.appendChild(window.renderPhoto(picturesArray[j]));
    }
    pictureListElement.appendChild(fragment);

    var slidersOpenElement = document.querySelectorAll('.picture');
    for (var z = 0; z <= slidersOpenElement.length - 1; z++) {
      slidersOpenElement[z].addEventListener('click', openPhotoHandler, true);
    }
  };

  window.errorRenderPhotoHandler = function (errorMessage) {
    var whereInsertFragmentElement = document.querySelector('.overlay.setup');
    var messageError = document.createElement('div');
    messageError.className = 'alert-danger';
    messageError.innerHTML = errorMessage;
    messageError.style = 'display:block;margin:0 auto;padding:10px;text-align:center; background-color:#ee4830;color:#ffffff';
    whereInsertFragmentElement.prepend(messageError);
  };

  window.backend.load(window.successRenderPhotoHandler, window.errorRenderPhotoHandler);

  function sliderEscPressHandler(e) {
    if (e.keyCode === ESC_KEYCODE) {
      closeSlider();
    }
  }

  function openSlider() {
    galleryOverlayElement.classList.remove('hidden');
    document.addEventListener('keydown', sliderEscPressHandler);
  }

  function closeSlider() {
    galleryOverlayElement.classList.add('hidden');
    document.removeEventListener('keydown', sliderEscPressHandler);
  }

  sliderCloseElement.tabIndex = 0;

  function openPhotoHandler(e) {
    e.preventDefault();
    var el = e.currentTarget.children[0];
    window.renderMainPhoto(el, window.picturesArray);
    openSlider();
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
