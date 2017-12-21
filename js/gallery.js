'use strict';
(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var galleryOverlayElement = document.querySelector('.gallery-overlay');
  var pictureListElement = document.querySelector('.pictures');
  var sliderCloseElement = galleryOverlayElement.querySelector('.gallery-overlay-close');

  function sortFilterLikes(picturesArray) {
    var sortedArray = picturesArray.slice();
    sortedArray.sort(function (first, second) {
      return second.likes - first.likes;
    });
    return sortedArray;
  }

  function sortFilterComments(picturesArray) {
    var sortedArray = picturesArray.slice();
    sortedArray.sort(function (first, second) {
      return second.comments.length - first.comments.length;
    });
    return sortedArray;
  }

  function sortFilterRandomize(picturesArray) {
    var sortedArray = picturesArray.slice();
    sortedArray.sort(function () {
      return Math.random() - 0.5;
    });
    return sortedArray;
  }

  var filterFormElement = document.querySelector('.filters');

  function changeFilterSort(picturesArray) {
    var filterSortElements = document.querySelectorAll('.filters input[type="radio"]');
    for (var i = 0; i < filterSortElements.length; i++) {
      if (filterSortElements[i].checked) {
        var filter = filterSortElements[i].value;
        var filterSort;

        switch (filter) {
          case 'recommend':
            filterSort = picturesArray;
            break;
          case 'popular':
            filterSort = sortFilterLikes(picturesArray);
            break;
          case 'discussed':
            filterSort = sortFilterComments(picturesArray);
            break;
          case 'random':
            filterSort = sortFilterRandomize(picturesArray);
            break;
        }
        break;
      }
    }
    return filterSort;
  }

  function updatePictures() {
    pictureListElement.innerHTML = '';
    var picturesArray = window.picturesArray.slice();
    var pictures = changeFilterSort(picturesArray);
    var fragment = document.createDocumentFragment();
    for (var j = 0; j < pictures.length; j++) {
      fragment.appendChild(window.renderPhoto(pictures[j]));
    }
    pictureListElement.appendChild(fragment);
    var slidersOpenElement = document.querySelectorAll('.picture');
    for (var k = 0; k <= slidersOpenElement.length - 1; k++) {
      slidersOpenElement[k].addEventListener('click', openPhotoHandler, true);
    }
  }

  function successRenderPhotoHandler(picturesArray) {
    window.picturesArray = picturesArray; // первоначальный массив картинок
    filterFormElement.classList.remove('filters-inactive');
    updatePictures();
  }

  window.errorRenderPhotoHandler = function (errorMessage) {
    if (errorMessage) {
      var whereInsertFragmentElement = document.querySelector('body');
      var messageErrorElement = document.createElement('div');
      messageErrorElement.className = 'alert-danger';
      messageErrorElement.innerHTML = errorMessage;
      messageErrorElement.style = 'position:fixed;top:10px;left:50%;transform:translate(-50%);z-index:3;width:582px;display:block;margin:0 auto;padding:10px;text-align:center; background-color:#ee4830;color:#ffffff';
      whereInsertFragmentElement.prepend(messageErrorElement);
    }
  };

  filterFormElement.addEventListener('change', function () {
    window.debounce(updatePictures);
  });

  window.backend.load(successRenderPhotoHandler, window.errorRenderPhotoHandler);

  function sliderEscPressHandler(evt) {
    if (evt.keyCode === ESC_KEYCODE) {
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

  function openPhotoHandler(evt) {
    evt.preventDefault();
    var el = evt.currentTarget.children[0];
    window.renderMainPhoto(el, window.picturesArray);
    openSlider();
  }

  sliderCloseElement.addEventListener('click', function () {
    closeSlider();
  });

  sliderCloseElement.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      closeSlider();
    }
  });
})();
