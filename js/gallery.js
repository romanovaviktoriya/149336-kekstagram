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
      if (first.likes > second.likes) {
        return -1;
      } else if (first.likes < second.likes) {
        return 1;
      } else {
        return 0;
      }
    });
    return sortedArray;
  }

  function sortFilterComments(picturesArray) {
    var sortedArray = picturesArray.slice();
    sortedArray.sort(function (first, second) {
      if (first.comments.length > second.comments.length) {
        return -1;
      } else if (first.comments.length < second.comments.length) {
        return 1;
      } else {
        return 0;
      }
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
    var filterSortElements = document.querySelector('.filters').querySelectorAll('input[type="radio"]');
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
      }
    }
    return filterSort;
  }

  function successRenderPhotoHandler(picturesArray) {
    window.picturesArray = picturesArray; // первоначальный массив картинок

    filterFormElement.classList.remove('filters-inactive');
    var array = changeFilterSort(picturesArray); // отсортированный массив картинок

    var fragment = document.createDocumentFragment();
    for (var j = 0; j < array.length; j++) {
      fragment.appendChild(window.renderPhoto(array[j]));
    }
    var pictureElements = pictureListElement.querySelectorAll('.picture');
    if (pictureElements) {
      pictureListElement.innerHTML = '';
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

  filterFormElement.addEventListener('change', function () {
    window.debounce(successRenderPhotoHandler(window.picturesArray));
  });

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
