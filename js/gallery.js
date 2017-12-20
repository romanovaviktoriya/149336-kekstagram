'use strict';
(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var galleryOverlayElement = document.querySelector('.gallery-overlay');
  var pictureListElement = document.querySelector('.pictures');
  var sliderCloseElement = galleryOverlayElement.querySelector('.gallery-overlay-close');

  function successRenderPhotoHandler(picturesArray) {
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
  }

  window.errorRenderPhotoHandler = function (errorMessage) {
    if (errorMessage) {
      var whereInsertFragmentElement = document.querySelector('body');
      window.messageErrorElement = document.createElement('div');
      window.messageErrorElement.className = 'alert-danger';
      window.messageErrorElement.innerHTML = errorMessage;
      window.messageErrorElement.style = 'position:fixed;top:10px;left:50%;transform:translate(-50%);z-index:3;width:582px;display:block;margin:0 auto;padding:10px;text-align:center; background-color:#ee4830;color:#ffffff';
      whereInsertFragmentElement.prepend(window.messageErrorElement);
    }
  };

  window.backend.load(successRenderPhotoHandler, window.errorRenderPhotoHandler);

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
