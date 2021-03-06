'use strict';
(function () {
  var uploadFormElement = document.querySelector('#upload-select-image');
  var uploadFileElement = uploadFormElement.querySelector('#upload-file');
  var uploadCancelElement = uploadFormElement.querySelector('#upload-cancel');
  var focusUploadDescriptionElement = uploadFormElement.querySelector('.upload-form-description');
  var uploadLevelElement = uploadFormElement.querySelector('.upload-effect-level');
  var uploadLevelInputElement = uploadLevelElement.querySelector('.upload-effect-level-value');
  var scopeElement = uploadLevelElement.querySelector('.upload-effect-level-line');
  var effectLevelPinElement = uploadLevelElement.querySelector('.upload-effect-level-pin');
  var effectLevelLineElement = uploadLevelElement.querySelector('.upload-effect-level-val');
  var scaleBtnElements = uploadFormElement.querySelectorAll('.upload-resize-controls-button');
  var inputValueElement = uploadFormElement.querySelectorAll('.upload-resize-controls-value');

  uploadFileElement.addEventListener('change', function () {
    openUploadForm();
  });

  uploadCancelElement.addEventListener('click', function () {
    closeUploadForm();
  });

  function uploadFormEscPressHandler(evt) {
    window.util.isEscEvent(evt, closeUploadForm);
  }

  function openUploadForm() {
    uploadFormElement.querySelector('.upload-overlay').classList.remove('hidden');
    document.addEventListener('keydown', uploadFormEscPressHandler);
  }

  var messageErrorElement = document.querySelector('.alert-danger');

  function hideErrorHandler() {
    if (messageErrorElement) {
      document.querySelector('body').removeChild(messageErrorElement);
    }
    document.removeEventListener('click', hideErrorHandler);
  }

  document.addEventListener('click', hideErrorHandler);

  function closeUploadForm() {
    if (messageErrorElement) {
      document.querySelector('body').removeChild(messageErrorElement);
    }
    if (focusUploadDescriptionElement === document.activeElement) {
      return;
    } else {
      uploadFormElement.querySelector('.upload-overlay').classList.add('hidden');
      resetForm();
      document.removeEventListener('keydown', uploadFormEscPressHandler);
    }
  }

  uploadCancelElement.addEventListener('keydown', function (evt) {
    window.util.isEnterEvent(evt, closeUploadForm);
  });

  var imagePreviewElement = uploadFormElement.querySelector('.effect-image-preview');
  var uploadControlsElement = uploadFormElement.querySelector('.upload-effect-controls');

  function checkFilter(newPercent) {
    var filterElements = uploadControlsElement.querySelectorAll('input[type="radio"]');
    for (var i = 0; i < filterElements.length; i++) {
      if (filterElements[i].checked) {
        var filter = filterElements[i].value;
        var filterValue;

        switch (filter) {
          case 'none':
            filterValue = 'none';
            break;
          case 'chrome':
            filterValue = 'grayscale(' + String(parseFloat(newPercent / 100).toFixed(2)) + ')';
            break;
          case 'sepia':
            filterValue = 'sepia(' + String(parseFloat(newPercent / 100).toFixed(2)) + ')';
            break;
          case 'marvin':
            filterValue = 'invert(' + String(newPercent) + '%)';
            break;
          case 'phobos':
            filterValue = 'blur(' + String(Math.round((newPercent * 3) / 100)) + 'px)';
            break;
          case 'heat':
            filterValue = 'brightness(' + String(parseFloat((newPercent * 3) / 100).toFixed(1)) + ')';
            break;
        }
        imagePreviewElement.style.filter = filterValue;
        return;
      }
    }
  }

  function addEffectImageHandler(evt) {
    if (evt.target.className === 'upload-effect-preview') {
      return;
    }
    var str = evt.target.id;
    str = str.substring(7);
    if (str === 'effect-none') {
      uploadLevelElement.classList.add('hidden');
    } else {
      uploadLevelElement.classList.remove('hidden');
    }
    imagePreviewElement.className = 'effect-image-preview ' + str;

    var newPercent = 20;
    checkFilter(newPercent);
    effectLevelPinElement.style.left = newPercent + '%';
    effectLevelLineElement.style.width = newPercent + '%';
    uploadLevelInputElement.value = Math.round(newPercent);
  }

  uploadControlsElement.addEventListener('change', addEffectImageHandler, false);

  function changeScale(scale) {
    imagePreviewElement.style['transform'] = 'scale(' + scale / 100 + ')';
  }

  for (var i = 0; i < scaleBtnElements.length; i++) {
    scaleBtnElements[i].addEventListener('click', function (evt) {
      window.initializeImageScale(evt.currentTarget, changeScale);
    });
  }

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
    var hashTags = str.split(' ');
    if (hashTags.length > 5) {
      uploadFormElement.querySelector('.upload-form-hashtags').classList.add('error');
      return 'Хэштегов больше 5';
    }

    // проверяем чтобы начинался с решетки и имел не более 20 символов
    var regexp = /(#[А-Яа-яЁёA-Za-z]{1,20}$)/gi;
    for (var t = 0; t < hashTags.length; t++) {
      if (hashTags[t].match(regexp) === null) {
        uploadFormElement.querySelector('.upload-form-hashtags').classList.add('error');
        return 'Хэштег ' + hashTags[t] + ' невалиден';
      }
    }

    // проверяем, чтобы массив уникальных тегов по длине соответствовал массиву с исходными тегами
    var uniqueTags = unique(str.toLowerCase().split(' '));
    if (uniqueTags.length !== hashTags.length) {
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
    messageElement.textContent = validationResult;
    parentElement.insertBefore(messageElement, uploadHashtagsElement);
  }

  function resetForm() {
    uploadFormElement.reset();
    inputValueElement.value = 100;
    imagePreviewElement.className = 'effect-image-preview';
    imagePreviewElement.style['transform'] = '';
    imagePreviewElement.style.filter = '';
    effectLevelPinElement.style.left = '20%';
    effectLevelLineElement.style.width = '20%';
    uploadLevelElement.classList.add('hidden');
    var messageElement = document.querySelector('.alert-danger');
    if (messageElement) {
      messageElement.parentNode.removeChild(messageElement);
    }
  }

  function submitForm() {
    hideErrorHandler();
    window.backend.save(new FormData(uploadFormElement), function () {
      uploadFormElement.querySelector('.upload-overlay').classList.add('hidden');
      resetForm();
    }, window.errorRenderPhotoHandler);
  }

  submitBtnElement.addEventListener('click', function (evt) {
    evt.preventDefault();
    var str = uploadFormElement.querySelector('.upload-form-hashtags').value;
    if (str !== '') {
      var validationResult = validateHashTags(str);
      if (validationResult === null) {
        uploadFormElement.querySelector('.upload-form-hashtags').classList.remove('error');
        submitForm(evt);
      } else {
        showMessageDanger(validationResult);
      }
    } else {
      submitForm(evt);
    }
  });

  // начало перетаскивания ползунка
  function getCoordsScope(elem) {
    var box = elem.getBoundingClientRect();

    return {
      left: box.left,
      right: box.right
    };
  }

  function getCoordsPin(mouseX) {
    // вычисляем координаты ползунка
    var scopeEffectLevelPin = getCoordsScope(scopeElement);
    // вычисляем новое положение ползунка
    var newPercent = (mouseX - scopeEffectLevelPin.left) * 100 / (scopeEffectLevelPin.right - scopeEffectLevelPin.left);
    // если движение в пределах границ, меняем положение ползунка
    if (newPercent > 0 && newPercent < 100) {
      effectLevelPinElement.style.left = newPercent + '%';
      effectLevelLineElement.style.width = newPercent + '%';
      uploadLevelInputElement.value = Math.round(newPercent);
    }
    return newPercent;
  }

  effectLevelPinElement.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    // обновлять смещение относительно первоначальной точки
    var onMouseMove = function (moveEvent) {
      moveEvent.preventDefault();

      var newPercent = getCoordsPin(moveEvent.clientX);
      checkFilter(newPercent);
    };

    var onMouseUp = function (upEvent) {
      upEvent.preventDefault();

      // при отпускании мыши прекратить слушать события движения мыши
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    // обработчики события передвижения мыши и отпускания кнопки мыши
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
})();
