'use strict';
(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

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
  var uploadControlsElement = uploadFormElement.querySelector('.upload-effect-controls');

  function addEffectImageHandler(event) {
    var str = event.target.previousElementSibling.id;
    str = str.substring(7);
    imagePreviewElement.className = 'effect-image-preview ' + str;
  }

  uploadControlsElement.addEventListener('click', addEffectImageHandler, false);

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
    var regexp = /(#[А-Яа-яЁёA-Za-z]{1,20}$)/gi;
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
    var messageElement = document.createElement('div');

    messageElement.className = 'alert-danger';
    messageElement.innerHTML = validationResult;
    parentElement.insertBefore(messageElement, uploadHashtagsElement);
  }

  submitBtnElement.addEventListener('click', function (event) {
    event.preventDefault();
    var str = uploadFormElement.querySelector('.upload-form-hashtags').value;
    if (!str) {
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
