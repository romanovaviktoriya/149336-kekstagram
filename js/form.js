'use strict';
(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  var uploadFormElement = document.querySelector('#upload-select-image');
  var uploadFileElement = uploadFormElement.querySelector('#upload-file');
  var uploadCancelElement = uploadFormElement.querySelector('#upload-cancel');
  var focusUploadDescriptionElement = uploadFormElement.querySelector('.upload-form-description');
  var uploadLevelElement = uploadFormElement.querySelector('.upload-effect-level');
  var uploadLevelInputElement = uploadLevelElement.querySelector('.upload-effect-level-value');
  var scopeElement = uploadLevelElement.querySelector('.upload-effect-level-line');
  var effectLevelPinElement = uploadLevelElement.querySelector('.upload-effect-level-pin');
  var effectLevelLineElement = uploadLevelElement.querySelector('.upload-effect-level-val');

  uploadFileElement.addEventListener('change', function () {
    openUploadForm();
  });

  uploadCancelElement.addEventListener('click', function () {
    closeUploadForm();
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

  function checkFilter() {
    var newPercent = getCoordsPin(event.clientX);
    var inp = uploadControlsElement.querySelectorAll('input');

    for (var i = 0; i < inp.length; i++) {
      if (inp[i].type === 'radio' && inp[i].checked) {
        var filter = inp[i].value;
        var znach;
        switch (filter) {
          case 'none':
            znach = 'none';
            break;
          case 'chrome':
            znach = 'grayscale(' + String(parseFloat(newPercent / 100).toFixed(2)) + ')';
            break;
          case 'sepia':
            znach = 'sepia(' + String(parseFloat(newPercent / 100).toFixed(2)) + ')';
            break;
          case 'marvin':
            znach = 'invert(' + String(newPercent) + '%)';
            break;
          case 'phobos':
            znach = 'blur(' + String(Math.round((newPercent * 3) / 100)) + 'px)';
            break;
          case 'heat':
            znach = 'brightness(' + String(parseFloat((newPercent * 3) / 100).toFixed(1)) + ')';
            break;
        }
      }
    }
  }

  function addEffectImageHandler(event) {
    if (event.target.className === 'upload-effect-preview') {
      return;
    }
    var str = event.target.id;
    str = str.substring(7);
    if (str === 'effect-none') {
      uploadLevelElement.classList.add('hidden');
    } else {
      uploadLevelElement.classList.remove('hidden');
    }
    imagePreviewElement.className = 'effect-image-preview ' + str;
  }

  function changeFilterHandler() {
    var inp = uploadControlsElement.querySelectorAll('input');
    for (var i = 0; i < inp.length; i++) {
      if (inp[i].type === 'radio' && inp[i].checked) {
        var filter = inp[i].value;
        var defaultPercent;

        switch (filter) {
          case 'none':
            defaultPercent = 0;
            break;
          default:
            defaultPercent = 100;
        }
        effectLevelPinElement.style.left = defaultPercent + '%';
        effectLevelLineElement.style.width = defaultPercent + '%';
        uploadLevelInputElement.value = Math.round(defaultPercent);
      }
    }
    imagePreviewElement.style.filter = '';
  }

  uploadControlsElement.addEventListener('click', addEffectImageHandler, false);
  uploadControlsElement.addEventListener('change', changeFilterHandler, false);

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
    if (str !== '') {
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

  effectLevelPinElement.addEventListener('mousedown', function (event) {
    event.preventDefault();

    // обновлять смещение относительно первоначальной точки
    var onMouseMove = function (moveEvent) {
      moveEvent.preventDefault();

      getCoordsPin(moveEvent.clientX);
      var fil = checkFilter();
      imagePreviewElement.style.filter = fil;
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
