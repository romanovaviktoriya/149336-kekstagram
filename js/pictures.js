/**
 * Created by КузяАсер on 22.11.2017.
 */
'use strict';
(function () {
  var COMMENTS = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ];
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var PICTURES_COUNT = 25;

  function getRandomInteger(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
  }
  function getUrlImage(i) {
    return 'photos/' + (i + 1) + '.jpg';
  }
  function getCountLikes() {
    return getRandomInteger(15, 200);
  }
  function generateComments() {
    var text;
    var comments = [];
    var randomCount = getRandomInteger(1, 10);

    for (var i = 0; i < randomCount; i++) {
      text = '';
      for (var j = 0; j < getRandomInteger(1, 2); j++) {
        var indexComment = getRandomInteger(0, 5);
        text += COMMENTS[indexComment] + ' ';
      }
      comments.push(text);
    }
    return comments;
  }

  var galleryOverlayElement = document.querySelector('.gallery-overlay');

  var pictureListElement = document.querySelector('.pictures');

  var templateElement = document.querySelector('#picture-template').content.querySelector('.picture');
  var pictures = [];

  function generatePicturesArray() {
    for (var i = 0; i < PICTURES_COUNT; i++) {
      pictures[i] = {src: getUrlImage(i), likes: getCountLikes(), comments: generateComments()};
    }
  }
  generatePicturesArray();

  function renderPhoto(object) {
    var pictureElement = templateElement.cloneNode(true);

    pictureElement.querySelector('img').src = object.src;
    pictureElement.querySelector('.picture-likes').textContent = object.likes;
    pictureElement.querySelector('.picture-comments').textContent = object.comments.length;

    return pictureElement;
  }

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

  function renderMainPhoto(object) {
    var matchStr = getMatchStr(object);
    galleryOverlayElement.querySelector('img').src = object.src;
    galleryOverlayElement.querySelector('.likes-count').textContent = matchStr[1];
    galleryOverlayElement.querySelector('.comments-count').textContent = matchStr[0];
  }

  var fragmentElement = document.createDocumentFragment();
  for (var i = 0; i < PICTURES_COUNT; i++) {
    fragmentElement.appendChild(renderPhoto(pictures[i]));
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

  function clickHandler(e) {
    e.preventDefault();
    var el = e.currentTarget.children[0];
    renderMainPhoto(el);
    openSlider();
  }

  for (var j = 0; j <= slidersOpenElement.length - 1; j++) {
    slidersOpenElement[j].addEventListener('click', clickHandler, true);
  }

  sliderCloseElement.addEventListener('click', function () {
    closeSlider();
  });

  sliderCloseElement.addEventListener('keydown', function (e) {
    if (e.keyCode === ENTER_KEYCODE) {
      closeSlider();
    }
  });

  var uploadFormElement = document.querySelector('#upload-select-image');
  var uploadFileElement = uploadFormElement.querySelector('#upload-file');
  var uploadCancelElement = uploadFormElement.querySelector('#upload-cancel');
  var focusUploadDescriptionElement = uploadFormElement.querySelector('.upload-form-description');

  uploadFileElement.addEventListener('change', function () {
    openUploadForm();
  });

  uploadCancelElement.addEventListener('click', function () {
    closeUploadForm();
    uploadFileElement.click();
  });

  function uploadFormEscPressHandler(e) {
    if (e.keyCode === ESC_KEYCODE) {
      closeUploadForm();
    }
  }

  function openUploadForm() {
    uploadFormElement.querySelector('.upload-overlay').classList.remove('hidden');
    document.addEventListener('keydown', uploadFormEscPressHandler);
  }

  function closeUploadForm() {
    if (focusUploadDescriptionElement === document.activeElement) {
      event.preventDefault();
    } else {
      uploadFormElement.querySelector('.upload-overlay').classList.add('hidden');
      document.removeEventListener('keydown', uploadFormEscPressHandler);
    }
  }

  uploadCancelElement.addEventListener('keydown', function (e) {
    if (e.keyCode === ENTER_KEYCODE) {
      closeUploadForm();
    }
  });

  var imagePreviewElement = uploadFormElement.querySelector('.effect-image-preview');
  var effectImageElement = uploadFormElement.querySelectorAll('.upload-effect-label');

  function addEffectImageHandler(event) {
    var str = event.currentTarget.previousElementSibling.id;
    str = str.substring(7);
    imagePreviewElement.className = 'effect-image-preview ' + str;
  }

  for (var k = 0; k <= effectImageElement.length - 1; k++) {
    effectImageElement[k].addEventListener('click', addEffectImageHandler, true);
  }

  var decrementBtnElement = uploadFormElement.querySelector('.upload-resize-controls-button-dec');
  var incrementBtnElement = uploadFormElement.querySelector('.upload-resize-controls-button-inc');
  var inputValueElement = decrementBtnElement.nextElementSibling;

  function zoomInHandler() {
    var transformScale;

    if (inputValueElement.value < 100) {
      inputValueElement.value = String(parseInt(inputValueElement.value, 10) + 25);
      transformScale = 'scale(' + inputValueElement.value / 100 + ')';
      imagePreviewElement.style['transform'] = transformScale;
    }
  }

  function zoomOutHandler() {
    var transformScale;

    if (inputValueElement.value > 25) {
      inputValueElement.value = String(parseInt(inputValueElement.value, 10) - 25);
      transformScale = 'scale(' + inputValueElement.value / 100 + ')';
      imagePreviewElement.style['transform'] = transformScale;
    }
  }

  decrementBtnElement.addEventListener('click', zoomOutHandler);
  incrementBtnElement.addEventListener('click', zoomInHandler);

  // ------- Unique elements --------
  function unique(arr) {
    var obj = {};

    for (var l = 0; l < arr.length; l++) {
      var str = arr[l];
      obj[str] = true;
    }

    return Object.keys(obj);
  }

  function validateHashTags(str) {
    // проверяем количество
    var hashArr = str.split(' ');
    if (hashArr.length > 5) {
      uploadFormElement.querySelector('.upload-form-hashtags').classList.add('error');
      return 'Хэштегов больше 5';
    }

    // проверяем чтобы начинался с решетки и имел не более 20 символов
    var regexp = /(#[А-Яа-яЁё]{1,20}$)/gi;
    for (var m = 0; m < hashArr.length; m++) {
      if (hashArr[m].match(regexp) === null) {
        uploadFormElement.querySelector('.upload-form-hashtags').classList.add('error');
        return 'Хэштег ' + hashArr[m] + ' невалиден';
      }
    }

    // проверяем, чтобы массив уникальных тегов по длине соответствовал массиву с исходными тегами
    var uniqueTags = unique(str.toLowerCase().split(' '));
    if (uniqueTags.length !== hashArr.length) {
      uploadFormElement.querySelector('.upload-form-hashtags').classList.add('error');
      return 'Среди хэштегов есть дубликаты';
    }

    // Валидация пройдена
    return null;
  }

  var submitBtnElement = uploadFormElement.querySelector('#upload-submit');

  function showMessageDanger(validationResult) {
    var parentElement = uploadFormElement.querySelector('.upload-effect__container');
    var previosElement = uploadFormElement.querySelector('.upload-effect-controls');
    var uploadHashtagsElement = uploadFormElement.querySelector('.upload-form-hashtags');

    if (uploadHashtagsElement.previousElementSibling !== previosElement) {
      parentElement.removeChild(uploadFormElement.querySelector('.alert-danger'));
    }
    var message = document.createElement('div');

    message.className = 'alert-danger';
    message.innerHTML = validationResult;
    parentElement.insertBefore(message, uploadHashtagsElement);
  }

  submitBtnElement.addEventListener('click', function (event) {
    event.preventDefault();
    var str = uploadFormElement.querySelector('.upload-form-hashtags').value;
    if (!!str) {
      var validationResult = validateHashTags(str);
      if (validationResult === null) {
        uploadFormElement.querySelector('.upload-form-hashtags').classList.remove('error');
        uploadFormElement.submit();
      } else {
        showMessageDanger(validationResult);
      }
    } else {
      uploadFormElement.submit();
    }
  });
})();
